import sys, os, ctypes
from PyQt5.QtWidgets import QApplication, QMainWindow, QGridLayout, QAction, QLabel, QTreeWidget
from PyQt5.QtCore import Qt


class MainWindow(QMainWindow):
	def __init__(self):
		super().__init__()

		# Create layout
		self.grid_layout = QGridLayout()
		self.setLayout(self.grid_layout)

		# Menus and Actions
		self.add_menus()
		self.add_actions()

		# Status Bar
		self.label = QLabel()
		self.label.setText("Hello, World!")
		self.status_bar.addPermanentWidget(self.label)

		# Show Window
		self.init_window()

	# Create and add menu_bar, status_bar, and root menus
	def add_menus(self):
		self.menu_bar = self.menuBar()
		self.status_bar = self.statusBar()

		self.file_menu = self.menu_bar.addMenu("File")
		self.view_menu = self.menu_bar.addMenu("View")
		self.tools_menu = self.menu_bar.addMenu("Tools")
		self.help_menu = self.menu_bar.addMenu("Help")

	# Create, add and assign all actions
	def add_actions(self):
		self.quit_action = QAction("Exit", self)
		self.quit_action.setShortcut("Ctrl+q")

		self.settings_action = QAction("Settings", self)

		self.about_action = QAction("About Organizer", self)

		# Add Menu Actions and Separators
		self.file_menu.addAction(self.settings_action)
		self.file_menu.addSeparator()
		self.file_menu.addAction(self.quit_action)
		self.help_menu.addAction(self.about_action)

		# Connect Actions to Triggers
		self.quit_action.triggered.connect(self.quit_trigger)

	# Set window title, window size, icon and show window
	def init_window(self):
		script_path = os.path.dirname(os.path.realpath(__file__))
		# self.setWindowIcon(QIcon("{}{}IPycon.png".format(script_path, os.path.sep)))
		self.setWindowTitle("Organizer 2019")
		self.resize(640, 600)
		self.show()

	# Quit application trigger
	def quit_trigger(self):
		qApp.quit()


def main():
		app_id = "ErikWDev.Organizer.Organizer.0.1.0"
		ctypes.windll.shell32.SetCurrentProcessExplicitAppUserModelID(app_id)

		app = QApplication(sys.argv)
		window = MainWindow()

		sys.exit(app.exec_())

if __name__ == "__main__":
	main()
