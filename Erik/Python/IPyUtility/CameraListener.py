from zeroconf import ServiceBrowser, Zeroconf
import socket
import ipaddress

class CameraListener:

	def remove_service(self, zeroconf, type, name):
		print("Service {} removed".format(name,))

	def add_service(self, zeroconf, type, name):
		info = zeroconf.get_service_info(type, name)
		print("Service {} added, service info: {}".format(name, info))
		

zeroconf = Zeroconf()
listener = MyListener()
browser = ServiceBrowser(zeroconf, "_http._tcp.local.", listener)
try:
	input("Press enter to exit...\n\n")
finally:
	zeroconf.close()
