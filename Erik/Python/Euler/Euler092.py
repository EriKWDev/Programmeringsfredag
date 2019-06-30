
# Answer: 8581146

memory = {}
memory2 = {}

def number_chain(n):
	new_num = n

	while(new_num > 0 and new_num != 1 and new_num != 89):
		num = 0

		if memory.get(new_num) != None:
			num = memory.get(new_num)
		else:
			for s in str(new_num):
				num += int(s)**2
			memory[new_num] = num

		new_num = num
		if memory2.get(new_num) != None:
			return memory2.get(new_num)

	memory2[n] = new_num

	return new_num

n = 0
for i in range(10000000):
	if number_chain(i) == 89:
		n += 1

print(n)
