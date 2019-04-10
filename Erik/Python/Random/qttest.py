import sys
from PyQt5 import QtCore, QtWidgets, QtGui


class main(QtWidgets.QDialog):
    def __init__(self):
        super(main, self).__init__()
        self.setMinimumSize(800,500)
        # self.setAttribute(QtCore.Qt.WA_TranslucentBackground,on=True)


if __name__ == "__main__":
    app = QtWidgets.QApplication(sys.argv)
    mw = main()
    mw.setWindowOpacity(.40)
    mw.show()
    sys.exit(app.exec())
