import sys
from PyQt5 import QtWidgets

def window():
	app = QtWidgets.QApplication(sys.argv)
	window = QtWidgets.QWidget()
	window.setWindowTitle("AXIS IP Utility in Python")
	window.setGeometry(100, 100, 300, 300)

	label1 = QtWidgets.QLabel(window)
	label1.setText("Hello, World!")

	window.show()
	sys.exit(app.exec_())

window()
