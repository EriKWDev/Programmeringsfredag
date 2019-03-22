import sys
from PyQt5.QtWidgets import QMenu, QApplication, QMainWindow, QAction, qApp, QVBoxLayout, QWidget, QTreeWidget, QTreeWidgetItem
from PyQt5.QtCore import Qt

class Window(QMainWindow):

	def __init__(self):
		super().__init__()

		# Menu Bar
		menu_bar = self.menuBar()
		status_bar = self.statusBar()

		# Root Menus
		file_menu = menu_bar.addMenu("File")
		view_menu = menu_bar.addMenu("View")
		view_language_menu = view_menu.addMenu ("Language")
		tools_menu = menu_bar.addMenu("Tools")
		help_menu = menu_bar.addMenu("Help")

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
		devices = [
		["Camera1", "192.168.0.10", "ACC8TEMP"],
		["Camera2", "192.168.0.10", "ACC8TEMP"],
		["Camera3", "192.168.0.10", "ACC8TEMP"]
		]
		main_widget = QWidget(self)
		self.devices_tree = QTreeWidget()
		self.devices_tree.headerItem().setText(0, "Name")
		self.devices_tree.headerItem().setText(1, "IP Address")
		self.devices_tree.headerItem().setText(2, "ID")

		self.devices_tree.customContextMenuRequested.connect(self.open_menu)
		self.devices_tree.setContextMenuPolicy(Qt.CustomContextMenu)

		for i in range(0, len(devices)):
			devices_tree_item = QTreeWidgetItem(self.devices_tree)
			[devices_tree_item.setText(j, devices[i][j]) for j in range(0, 3)]

		layout = QVBoxLayout()
		layout.addWidget(self.devices_tree)
		main_widget.setLayout(layout)
		self.setCentralWidget(main_widget)

		# Events
		self.quit_action.triggered.connect(self.quit_trigger)

		self.setWindowTitle("AXIS IP Utility in Python - Erik Wilhelm Gren 2019")
		status_bar.showMessage("{} devices".format(len(devices)))
		self.resize(640, 300)

		self.show()

	def open_menu(self, position):
		menu = QMenu()

		indexes = self.devices_tree.selectedIndexes()
		print(indexes)

		menu.addAction(self.open_in_web_browser)
		menu.exec_(self.devices_tree.viewport().mapToGlobal(position))

	def quit_trigger(self):
		qApp.quit()


if __name__ == "__main__":
	app = QApplication(sys.argv)
	print("Input parameters: {}".format(sys.argv))
	window = Window()
	sys.exit(app.exec_())
