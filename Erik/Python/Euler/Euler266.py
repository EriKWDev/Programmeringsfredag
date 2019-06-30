
import math

def product_of_primes(n):
	product = 1
	for i in range(1, n):
		prime = True
		for j in range(2, i-1):
			if(i%j == 0):
				prime = False

		if prime:
			product *= i

	return product

def pseudo_square_root(n):
	d = 1
	root = math.sqrt(n)

	for i in range(1, n+1):
		if(n % i == 0):
			if i > d and i < root:
				d = i

			if i >= root:
				return d

	return d

p = product_of_primes(42)
print(pseudo_square_root(p))
