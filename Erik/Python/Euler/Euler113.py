
def increasing(number):
	s = str(number)
	for i in range(len(s)):
		if i + 1 < len(s):
			if s[i] > s[i + 1]:
				return False

	return True

def decreasing(number):
	s = str(number)
	for i in range(len(s)):
		if i + 1 < len(s):
			if s[i] < s[i + 1]:
				return False

	return True

def bouncy(number):
	return not (increasing(number) or decreasing(number))

n = 0

for i in range(10**6 - 1):
	if bouncy(i) == False:
		n += 1

print(n)
