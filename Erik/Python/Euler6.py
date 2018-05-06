#Find the difference between the sum of the squares of the first one hundred natural numbers and the square of the sum.

#Answer: 25164150

rmax = 100
r = range (1, rmax + 1)

n = 0
for i in r:
    n += i**2

print ((sum (r)**2) - n)