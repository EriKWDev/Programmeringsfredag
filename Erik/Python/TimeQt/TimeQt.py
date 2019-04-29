import sys, os, ctypes
from PyQt5.QtWidgets import *
from PyQt5.QtCore import *
from PyQt5.QtGui import *
import time

class Window(QMainWindow):
	def __init__(self):
		super().__init__()

		# Menu Bar
		self.menu_bar = self.menuBar()
		self.status_bar = self.statusBar()

		# Root Menus
		file_menu = self.menu_bar.addMenu("File")

		# Create Menu Actions
		self.quit_action = QAction("Exit", self)
		self.quit_action.setShortcut("Ctrl+q")

		# Add Menu Actions
		file_menu.addAction(self.quit_action)

		# Layout
		self.time_text = QLabel()
		self.start_time = time.time()
		self.time_text.setText(str(self.start_time))
		self.time_text.setFont(QFont("Times", 68, QFont.Normal))
		self.time_text.setSizePolicy(QSizePolicy.Expanding, QSizePolicy.Expanding)
		self.time_text.setAlignment(Qt.AlignCenter)

		self.layout = QGridLayout()
		self.layout.addWidget(self.time_text, 0, 0)
		self.main_widget = QWidget()
		self.main_widget.setLayout(self.layout)
		self.setCentralWidget(self.main_widget)

		# Events
		self.quit_action.triggered.connect(self.quit_trigger)
		#self.devices_tree.itemDoubleClicked.connect(self.open_in_web_browser_trigger)

		# Show Window
		self.setWindowTitle("TimeQt")

		self.label = QLabel()
		self.label.setText("TimeQt by ErikWDev")
		self.status_bar.addPermanentWidget(self.label)
		self.resize(700, 300)
		self.show()

	def set_status_bar(self, text):
		self.status_bar.showMessage(text)

	def quit_trigger(self):
		qApp.quit()


if __name__ == "__main__":
	app_id = "erikwdev.timeqt.timeqt.0.0.1"
	ctypes.windll.shell32.SetCurrentProcessExplicitAppUserModelID(app_id)

	app = QApplication(sys.argv)
	script_path = os.path.dirname(os.path.realpath(__file__))
	app.setWindowIcon(QIcon(QPixmap("{}{}IPycon.png".format(script_path, os.path.sep))))
	window = Window()
	sys.exit(app.exec_())
