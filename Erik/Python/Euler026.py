import re

def get_repeating_pattern (n) :
    d = float(n)
    c = 1/float(d)
    s = str (c)
    a = ""

    for i in range (2, len(s)) :
        a += s[i]

    p = re.compile(ur'(.+?)\1+')

    return (re.findall(p, a))

for i in range (1, 1000) :
    e = get_repeating_pattern (i)
    if (str(e) != "[]") :
        print (str(i) + " -> " + str(e) + " : " + str(len(str(e))))
