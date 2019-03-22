import sys
from PyQt5.QtWidgets import QMenu, QApplication, QMainWindow, QAction, qApp, QVBoxLayout, QWidget, QTreeWidget, QTreeWidgetItem, QHeaderView
from PyQt5.QtCore import Qt
from PyQt5.QtGui import *
from zeroconf import ServiceBrowser, Zeroconf
import socket
import ipaddress
import webbrowser


class CameraListener:

	def __init__(self, window):
		self.window = window

	def remove_service(self, zeroconf, type, name):
		print("Service {} removed".format(name,))

	def add_service(self, zeroconf, type, name):
		info = zeroconf.get_service_info(type, name)

		self.window.devices.append((info))
		self.window.update_devices_tree()


class Window(QMainWindow):

	def __init__(self):
		super().__init__()
		self.init_search_for_cameras()

		# Menu Bar
		self.menu_bar = self.menuBar()
		self.status_bar = self.statusBar()

		# Root Menus
		file_menu = self.menu_bar.addMenu("File")
		view_menu = self.menu_bar.addMenu("View")
		view_language_menu = view_menu.addMenu ("Language")
		tools_menu = self.menu_bar.addMenu("Tools")
		help_menu = self.menu_bar.addMenu("Help")

		# Create Menu Actions
		self.quit_action = QAction("Exit", self)
		self.quit_action.setShortcut("Ctrl+q")

		self.help_action = QAction("About AXIS IP Utility", self)
		self.help_action.setShortcut("Ctrl+h")

		self.assign_network_parameters_action = QAction("Assign Network Parameters", self)
		self.assign_network_parameters_action.setShortcut("Ctrl+c")

		self.assign_ip_address_action = QAction("Assign IP Address", self)
		self.assign_ip_address_action.setShortcut("Ctrl+a")

		self.assign_serial_no_ip_address_action = QAction("Assign IP Address Using Serial Number", self)
		self.assign_serial_no_ip_address_action.setShortcut("Ctrl+n")

		self.test_ip_address_action = QAction("Test IP Address", self)
		self.test_ip_address_action.setShortcut("Ctrl+t")

		self.open_in_web_browser = QAction("Open in Web Browser", self)
		self.open_in_web_browser.setShortcut("Ctrl+o")

		# Add Menu Actions
		file_menu.addAction(self.quit_action)

		tools_menu.addAction(self.assign_network_parameters_action)
		tools_menu.addAction(self.assign_ip_address_action)
		tools_menu.addAction(self.assign_serial_no_ip_address_action)
		tools_menu.addAction(self.test_ip_address_action)

		help_menu.addAction(self.help_action)

		# List
		self.devices = []
		self.devices_tree = QTreeWidget()

		self.devices_tree.headerItem().setText(0, "Name")
		self.devices_tree.headerItem().setText(1, "IP Address")
		self.devices_tree.headerItem().setText(2, "Serial Number")

		self.devices_tree.header().setSectionResizeMode(0, QHeaderView.ResizeToContents)
		self.devices_tree.header().setSectionResizeMode(1, QHeaderView.Stretch)
		self.devices_tree.header().setSectionResizeMode(2, QHeaderView.Stretch)

		self.devices_tree.customContextMenuRequested.connect(self.open_menu)
		self.devices_tree.setContextMenuPolicy(Qt.CustomContextMenu)

		self.update_devices_tree()

		layout = QVBoxLayout()
		layout.addWidget(self.devices_tree)
		main_widget = QWidget()
		main_widget.setLayout(layout)
		self.setCentralWidget(main_widget)

		# Events
		self.quit_action.triggered.connect(self.quit_trigger)
		self.open_in_web_browser.triggered.connect(self.open_in_web_browser_trigger)
		self.devices_tree.itemDoubleClicked.connect(self.open_in_web_browser_trigger)

		# Show Window
		self.setWindowTitle("AXIS IP Utility in Python - Erik Wilhelm Gren 2019")
		self.update_status_bar()
		self.resize(640, 300)
		self.show()

	def update_status_bar(self):
		if len(self.devices) == 1:
			self.status_bar.showMessage("{} device".format(len(self.devices)))
		else:
			self.status_bar.showMessage("{} devices".format(len(self.devices)))

	def update_devices_tree(self):
		self.devices_tree.clear()

		for i in range(0, len(self.devices)):
			devices_tree_item = QTreeWidgetItem(self.devices_tree)
			# print(self.devices[i])
			devices_tree_item.setText(0, self.devices[i].name.split(".")[0])
			devices_tree_item.setText(1, str(self.byte_address_to_ip_addres(self.devices[i].address)))
			devices_tree_item.setText(2, self.devices[i].name.split("AXIS")[1])
			# print(ipaddress.ip_address(int.from_bytes(info.address, "big")))

		self.update_status_bar()

	def init_search_for_cameras(self):
		self.devices = []
		self.zeroconf = Zeroconf()
		self.listener = CameraListener(self)
		self.browser = ServiceBrowser(self.zeroconf, "_http._tcp.local.", self.listener)

	def byte_address_to_ip_addres(self, b):
		return ipaddress.ip_address(int.from_bytes(b, "big"))

	def open_menu(self, position):
		menu = QMenu()

		menu.addAction(self.open_in_web_browser)
		menu.exec_(self.devices_tree.viewport().mapToGlobal(position))

	def open_in_web_browser_trigger(self):
		item = self.devices_tree.selectedItems()
		if item:
			ip_address = item[0].text(1)
			url = "http://{}/".format(ip_address)
			print(url)
			webbrowser.open(url)

	def quit_trigger(self):
		qApp.quit()


if __name__ == "__main__":
	app = QApplication(sys.argv)
	window = Window()

	sys.exit(app.exec_())
	window.zeroconf.close()
