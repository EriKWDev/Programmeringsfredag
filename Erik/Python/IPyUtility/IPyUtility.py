import sys
from PyQt5.QtWidgets import QApplication, QMainWindow, QAction, qApp, QTableWidget, QTableWidgetItem, QVBoxLayout


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
		quit_action = QAction("Exit", self)
		quit_action.setShortcut("Ctrl+q")

		help_action = QAction("About AXIS IP Utility", self)
		help_action.setShortcut("Ctrl+h")

		assign_network_parameters_action = QAction("Assign Network Parameters", self)
		assign_network_parameters_action.setShortcut("Ctrl+c")

		assign_ip_address_action = QAction("Assign IP Address", self)
		assign_ip_address_action.setShortcut("Ctrl+a")

		assign_serial_no_ip_address_action = QAction("Assign IP Address Using Serial Number", self)
		assign_serial_no_ip_address_action.setShortcut("Ctrl+n")

		test_ip_address_action = QAction("Test IP Address", self)
		test_ip_address_action.setShortcut("Ctrl+t")

		# Add Menu Actions
		file_menu.addAction(quit_action)

		tools_menu.addAction(assign_network_parameters_action)
		tools_menu.addAction(assign_ip_address_action)
		tools_menu.addAction(assign_serial_no_ip_address_action)
		tools_menu.addAction(test_ip_address_action)

		help_menu.addAction(help_action)

		# List
		device_table = QTableWidget()
		device_table.setColumnCount(4)
		devices = ["Camera1", "Camera2", "Camera3"]
		for i in devices:
			device_table.insertRow(1)

		layout = QVBoxLayout()
		layout.addWidget(device_table)
		self.setLayout(layout)

		# Events
		quit_action.triggered.connect(self.quit_trigger)

		self.setWindowTitle("AXIS IP Utility in Python - Erik Wilhelm Gren 2019")
		status_bar.showMessage("{} devices".format(len(devices)))
		self.resize(640, 300)

		self.show()

	def quit_trigger(self):
		qApp.quit()


if __name__ == "__main__":
	app = QApplication(sys.argv)
	print("Input parameters: {}".format(sys.argv))
	window = Window()
	sys.exit(app.exec_())
