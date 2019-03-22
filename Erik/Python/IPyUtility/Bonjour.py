from zeroconf import ServiceBrowser, Zeroconf
import socket
import ipaddress

print(socket.gethostbyname(socket.gethostname()))

class MyListener:

	def remove_service(self, zeroconf, type, name):
		print("Service {} removed".format(name,))

	def add_service(self, zeroconf, type, name):
		info = zeroconf.get_service_info(type, name)
		print("Service {} added, service info: {}".format(name, info))
		# Convert Byte-Addres into IP Address
		# print(ipaddress.ip_address(int.from_bytes(info.address, "big")))


zeroconf = Zeroconf()
listener = MyListener()
browser = ServiceBrowser(zeroconf, "_http._tcp.local.", listener)
try:
	input("Press enter to exit...\n\n")
finally:
	zeroconf.close()
