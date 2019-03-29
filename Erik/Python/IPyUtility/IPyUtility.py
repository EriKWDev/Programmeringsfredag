import sys
from PyQt5.QtWidgets import QMenu, QApplication, QMainWindow, QAction, qApp, QVBoxLayout, QWidget, QTreeWidget, QTreeWidgetItem, QHeaderView, QLabel, QLineEdit, QPushButton
from PyQt5.QtCore import Qt
from PyQt5.QtGui import QIcon, QPixmap
from zeroconf import ServiceBrowser, Zeroconf
import os
import socket								# Part of Zeroconf Scanner
import ipaddress							# Convert bytes to ipaddresses
import webbrowser							# Open camera in webbrowser
import ctypes								# Fix Icon


class CameraListener:

	def __init__(self, window):
		self.window = window

	def remove_service(self, zeroconf, type, name):
		print("Service {} removed".format(name,))

	def add_service(self, zeroconf, type, name):
		info = zeroconf.get_service_info(type, name)
		print(type)
		print(info)
		print(zeroconf)
		new_camera = Camera(name, info.address, info.server)
		self.window.add_camera(new_camera)


class Camera:
	def __init__(self, name, byte_ip_address, server):
		self.name = name.split(".")[0]
		self.ip_address = str(self.byte_ip_address_to_ip_addres(byte_ip_address))
		if server.__contains__("axis-"):
			server = server.split("-")[1].upper()
		else:
			server = name

		self.serial_number = server.split(".")[0]

	def byte_ip_address_to_ip_addres(self, b):
		return ipaddress.ip_address(int.from_bytes(b, "big"))


class Window(QMainWindow):

	def __init__(self):
		super().__init__()
		self.devices = []
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

		self.refresh_action = QAction("Refresh", self)
		self.refresh_action.setShortcut("Ctrl+r")

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

		self.language_english_action = QAction("English", self)

		# Add Menu Actions
		file_menu.addAction(self.quit_action)

		tools_menu.addAction(self.assign_network_parameters_action)
		tools_menu.addAction(self.assign_ip_address_action)
		tools_menu.addAction(self.assign_serial_no_ip_address_action)
		tools_menu.addSeparator()
		tools_menu.addAction(self.test_ip_address_action)
		tools_menu.addSeparator()
		tools_menu.addAction(self.refresh_action)

		help_menu.addAction(self.help_action)

		view_language_menu.addAction(self.language_english_action)

		# List
		self.devices = []
		self.devices_tree = QTreeWidget()
		self.devices_tree.setSortingEnabled(True)

		self.devices_tree.headerItem().setText(0, "Name")
		self.devices_tree.headerItem().setText(1, "IP Address")
		self.devices_tree.headerItem().setText(2, "Serial Number")

		self.devices_tree.setColumnWidth(0, 260)
		self.devices_tree.setColumnWidth(1, 130)

		self.devices_tree.header().setSectionResizeMode(0, QHeaderView.Interactive)
		self.devices_tree.header().setSectionResizeMode(1, QHeaderView.Interactive)
		self.devices_tree.header().setSectionResizeMode(2, QHeaderView.Interactive)

		self.devices_tree.customContextMenuRequested.connect(self.open_menu)
		self.devices_tree.setContextMenuPolicy(Qt.CustomContextMenu)

		# Layout
		self.text_filter = QLineEdit()
		self.text_filter.setPlaceholderText("Type to filter...")

		self.layout = QVBoxLayout()
		self.layout.addWidget(self.text_filter)
		self.layout.addWidget(self.devices_tree)
		self.main_widget = QWidget()
		self.main_widget.setLayout(self.layout)
		self.setCentralWidget(self.main_widget)

		# Events
		self.quit_action.triggered.connect(self.quit_trigger)
		self.refresh_action.triggered.connect(self.refresh_trigger)

		self.text_filter.textChanged.connect(self.search_devices)

		self.open_in_web_browser.triggered.connect(self.open_in_web_browser_trigger)
		self.devices_tree.itemDoubleClicked.connect(self.open_in_web_browser_trigger)

		# Show Window
		self.setWindowTitle("AXIS IP Utility in Python - Erik Wilhelm Gren 2019")

		self.label = QLabel()
		self.label.setText("Interface: {}".format(socket.gethostbyname(socket.gethostname())))
		self.status_bar.addPermanentWidget(self.label)
		self.update_status_bar()
		self.resize(640, 300)
		self.show()

	def update_status_bar(self):
		self.set_status_bar(("{} device{}".format(len(self.devices), ("" if len(self.devices) == 1 else "s"))))

	def set_status_bar(self, text):
		self.status_bar.showMessage(text)

	def search_devices(self):
		query = self.text_filter.text()
		# print(query)
		if query == "":
			all_items = self.devices_tree.findItems("", Qt.MatchFlag(1), 0)
			for item in all_items:
				item.setHidden(False)
			self.update_status_bar()
		else:
			all_items = self.devices_tree.findItems("", Qt.MatchFlag(1), 0)
			for item in all_items:
				item.setHidden(True)

			items = self.devices_tree.findItems(query, Qt.MatchFlag(1), 0) + self.devices_tree.findItems(query, Qt.MatchFlag(1), 1) + self.devices_tree.findItems(query, Qt.MatchFlag(1), 2)
			for item in items:
				item.setHidden(False)
				print(item.text(0))
			self.set_status_bar("{} device{}".format(len(items), ("" if len(items) == 1 else "s")))

	def add_camera(self, camera):
		self.devices.append(camera)

		devices_tree_item = QTreeWidgetItem(self.devices_tree)
		devices_tree_item.setText(0, camera.name)
		devices_tree_item.setText(1, camera.ip_address)
		devices_tree_item.setText(2, camera.serial_number)

		self.update_status_bar()

	def refresh_trigger(self):
		self.reset()
		self.reset_search_for_cameras() # SOMETHING'S BROKEN ON WINDOWS 10!

	def reset(self):
		if(self.zeroconf):
			self.zeroconf.close()

		if(self.devices_tree):
			self.devices_tree.clearSelection()
			self.devices_tree.clear()

		if(self.devices):
			self.devices = []

		self.update_status_bar()

	def reset_search_for_cameras(self):
		self.zeroconf = Zeroconf()
		self.listener = CameraListener(self)
		self.browser = ServiceBrowser(self.zeroconf, "_http._tcp.local.", self.listener)

	def init_search_for_cameras(self):
		self.zeroconf = Zeroconf()
		self.listener = CameraListener(self)
		self.browser = ServiceBrowser(self.zeroconf, "_http._tcp.local.", self.listener)

	def open_menu(self, position):
		menu = QMenu()

		menu.addAction(self.open_in_web_browser)
		menu.exec_(self.devices_tree.viewport().mapToGlobal(position))

	def open_in_web_browser_trigger(self):
		item = self.devices_tree.selectedItems()
		if item:
			ip_address = item[0].text(1)
			url = "http://{}/".format(ip_address)
			webbrowser.open(url)

	def quit_trigger(self):
		qApp.quit()


if __name__ == "__main__":
	app_id = "axis.iputility.ipyutility.0.2.1"
	ctypes.windll.shell32.SetCurrentProcessExplicitAppUserModelID(app_id)

	app = QApplication(sys.argv)
	script_path = os.path.dirname(os.path.realpath(__file__))
	app.setWindowIcon(QIcon(QPixmap("{}{}IPycon.png".format(script_path, os.path.sep))))
	window = Window()

	# for i in range(0, 5):
	# 	window.add_camera(Camera("AXIS DEBUG {} - ABCDEFG".format(i), bytes([192, 168, 0, i*i])))

	#window.search_devices("0.16")

	sys.exit(app.exec_())
	window.zeroconf.close()
