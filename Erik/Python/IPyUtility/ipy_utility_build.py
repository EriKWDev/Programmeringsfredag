from setuptools import setup

OPTIONS={
	"iconfile":"IPycon.png",
}

setup(
	app=["IPyUtility.py"],
	name="IPy Utility",
	options={"py2app": OPTIONS},
	setup_requires=["py2app"],
)
