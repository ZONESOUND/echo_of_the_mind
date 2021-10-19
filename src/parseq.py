lines = []
with open('q.txt') as f:
    lines = f.readlines()

string = 'export let questions = [\n'
count = 0
for line in lines:
    if len(line) > 1:
        if count != 0:
            string += ', \n'
        count += 1
        print(f'line {count}: {line}')    
        string += f'`{line}`'
string += '];'
f = open("question.js", "w")
f.write(string)
f.close()

