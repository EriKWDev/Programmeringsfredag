#Given Collatz' problem, which starting number, under one million, produces the longest chain?

#Answer: 837799 (524 times)

n = N = j = currentBest = 0
storage = {}
nstr = ""

for i in range (1, 10**6):
    n = i
    j = 0
    while (n > 1):
        if (n % 2 == 0):
            n = n / 2
            j += 1
        else:
            n = ((n * 3) + 1)/2
            j += 2
        
        n = int (n)
        nstr = str (n)

        if (nstr in storage.keys ()):
            j += storage [nstr]
            n = 1

    storage[str(i)] = j

    if (j > currentBest):
        currentBest = j
        N = i
        print (N,"->",currentBest)

print (N,":",currentBest)