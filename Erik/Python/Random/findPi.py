pi = 3.14159265358979

def count_correct_digits(n):
	c = 0
	i = 0
	s_pi = str(pi)
	for s in str(n):
		if s == s_pi[i]:
			c += 1
		else:
			return c
		i += 1
	return c

for i in range(3, 3000):
	for j in range(1, int(i/2.5)):
		d = count_correct_digits(i/j)
		if d >= 8:
			print("Correct decimals: {}, {}/{} = {}".format(d-2, i, j, i/j))
