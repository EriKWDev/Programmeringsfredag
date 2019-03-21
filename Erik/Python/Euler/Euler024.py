
#Answer: 2783915460

from math import factorial

digits = range(10)
res = []
n = 999999 # PE uses 1-based indexing

for i in xrange(len(digits) - 1, -1, -1):
    index, n = divmod(n, factorial(i))
    res.append(digits.pop(index))

print ''.join(str(i) for i in res)
