// Content bank for the IGCSE 0478 Chapter 8 "Programming" Python practice site.
//
// window.MODULES is an ordered array of 10 modules, each with:
//   id, title, color        - identity + accent colour (see COLORS in app.js)
//   lesson: { concept, example, keyPoints }   - shown first
//   mcqs:  [{ q, options, correct, explain }] - auto-graded multiple choice
//   exercises: [ ... ]                        - coding tasks, graded in Pyodide
//
// Each exercise:
//   id, title, description (HTML), starter (editor code)
//   inputs   - OPTIONAL array of strings fed to input() calls in order (for
//              exercises that use input()); grading mocks input() with these.
//   hints    - array of strings, revealed one at a time by the Hint button
//   solution - full model-answer Python source, revealed by the Answer button
//   tests    - [{ name, code }]; code runs AFTER the student's code (and after
//              any input() calls) in the SAME namespace and must raise on
//              failure (assert is easiest). The captured stdout from the
//              student's run is available to test code as the string __stdout.

window.MODULES = [
  // ============================================================
  {
    id: "variables",
    title: "Variables, Constants & Data Types",
    color: "blue",
    hex: "#7c3aed",
    icon: "📦",
    lesson: {
      concept: `
        <p>A <b>variable</b> is a named store whose value can change while a program runs.
           A <b>constant</b> is a named store whose value must not change.</p>
        <p>Python doesn't have a special keyword for constants — by convention, programmers
           write constant names in <code>ALL_CAPS</code> so readers know not to reassign them.</p>
        <p>Python is also <b>dynamically typed</b>: you don't declare a variable's type — it's
           decided automatically from the value you assign. The five basic IGCSE data types are
           <code>int</code>, <code>float</code> (real), <code>str</code> (char/string),
           and <code>bool</code> (Boolean).</p>
      `,
      example: `CONST_PI = 3.142          # constant, by convention ALL_CAPS

radius = 5                # int
length = 12.0              # float
initial = 'D'              # a string of length 1 (Python has no separate 'char' type)
name = "Daichi"             # str
is_active = True            # bool

volume = radius * radius * length * CONST_PI
print("Volume of the cylinder is", volume)`,
      keyPoints: [
        "Python has no DECLARE statement — a variable is created the first time you assign to it",
        "Constants are just variables named in ALL_CAPS by convention — Python won't stop you changing them",
        "int, float, str and bool are the four Python types you need for IGCSE",
        "type(x) tells you the type Python has given a value",
      ],
    },
    mcqs: [
      {
        q: "Which of these follows Python's naming convention for a constant?",
        options: [`PI = 3.142`, `pi = 3.142`, `Const pi = 3.142`, `Dim pi As Double = 3.142`],
        correct: 0,
        explain: "ALL_CAPS names signal 'this shouldn't change' — Python has no real constant keyword.",
      },
      {
        q: "What is the type of the result of x = 7 / 2 in Python?",
        options: ["int", "float", "str", "bool"],
        correct: 1,
        explain: "The / operator always returns a float in Python 3, even if the result is a whole number.",
      },
      {
        q: "Which line correctly creates a Boolean variable?",
        options: [`Flag = True`, `Flag = "True"`, `Flag: Boolean = True`, `DECLARE Flag : BOOLEAN`],
        correct: 0,
        explain: `Flag = "True" makes a string, not a bool. Python's Boolean literals are True and False (capitalised, no quotes).`,
      },
    ],
    exercises: [
      {
        id: "var_cylinder",
        mode: "return",
        title: "Cylinder volume",
        description: `
          <p>Write a function <code>cylinder_volume(radius, length)</code> that returns the volume
             of a cylinder using the constant <code>CONST_PI = 3.142</code> already declared for you.</p>
          <p>Formula: <code>volume = radius * radius * length * CONST_PI</code></p>
        `,
        starter: `CONST_PI = 3.142

def cylinder_volume(radius, length):
    # your code here
    return None
`,
        inputs: null,
        hints: [
          "Multiply radius by itself, then by length, then by CONST_PI.",
          "Don't forget to return the result — a function with no return gives back None.",
        ],
        solution: `CONST_PI = 3.142

def cylinder_volume(radius, length):
    return radius * radius * length * CONST_PI
`,
        tests: [
          { name: "cylinder_volume(2, 5) is correct", code: `assert abs(cylinder_volume(2, 5) - 62.84) < 0.001` },
          { name: "cylinder_volume(1, 1) is correct", code: `assert abs(cylinder_volume(1, 1) - 3.142) < 0.001` },
          { name: "returns a number, not None", code: `assert cylinder_volume(3, 2) is not None` },
        ],
      },
      {
        id: "var_typedetective",
        mode: "return",
        title: "Data type detective",
        description: `
          <p>Write a function <code>describe(value)</code> that returns the name of
             <code>value</code>'s type as a string: <code>"int"</code>, <code>"float"</code>,
             <code>"str"</code> or <code>"bool"</code>.</p>
        `,
        starter: `def describe(value):
    # your code here
    return None
`,
        inputs: null,
        hints: [
          "Python's built-in type(value) gives you the type itself, e.g. <class 'int'>.",
          "Every type has a .__name__ attribute holding just the name as a string, e.g. type(5).__name__ == 'int'.",
        ],
        solution: `def describe(value):
    return type(value).__name__
`,
        tests: [
          { name: "describe(5) == 'int'", code: `assert describe(5) == "int"` },
          { name: "describe(5.0) == 'float'", code: `assert describe(5.0) == "float"` },
          { name: `describe("hi") == 'str'`, code: `assert describe("hi") == "str"` },
          { name: "describe(True) == 'bool'", code: `assert describe(True) == "bool"` },
        ],
      },

      {
        id: "var_isconst",
        mode: "return",
        title: "Is it a constant name?",
        description: `
          <p>Write a function <code>is_constant_name(name)</code> that returns <code>True</code>
             if <code>name</code> follows the ALL_CAPS constant convention (every letter is
             uppercase), and <code>False</code> otherwise.</p>
        `,
        starter: `def is_constant_name(name):
    # your code here
    return None
`,
        inputs: null,
        hints: [
          "Python strings have a built-in .isupper() check.",
          `"MAX_SPEED".isupper() is True because isupper() ignores underscores and only looks at letters.`,
        ],
        solution: `def is_constant_name(name):
    return name.isupper()
`,
        tests: [
          { name: "is_constant_name('PI') is True", code: `assert is_constant_name("PI") == True` },
          { name: "is_constant_name('Pi') is False", code: `assert is_constant_name("Pi") == False` },
          { name: "is_constant_name('MAX_SPEED') is True", code: `assert is_constant_name("MAX_SPEED") == True` },
          { name: "is_constant_name('speed') is False", code: `assert is_constant_name("speed") == False` },
        ],
      },
      {
        id: "var_typesummary",
        mode: "print",
        title: "Type summary",
        description: `
          <p>Write a function <code>print_type_summary(value)</code> that prints a message like
             <code>"5 is a int"</code> or <code>"hello is a str"</code> — the value, then
             <code>" is a "</code>, then its type name.</p>
        `,
        starter: `def print_type_summary(value):
    # your code here
    print()
`,
        inputs: null,
        hints: [
          "type(value).__name__ gives you the type's name as a string.",
          `print(value, "is a", type(value).__name__) does the job.`,
        ],
        solution: `def print_type_summary(value):
    print(value, "is a", type(value).__name__)
`,
        tests: [
          {
            name: "print_type_summary(5) mentions int",
            code: `import io, sys\n__cap = io.StringIO()\n__old = sys.stdout\nsys.stdout = __cap\nprint_type_summary(5)\nsys.stdout = __old\n__out = __cap.getvalue()\nassert "5" in __out and "int" in __out`,
          },
          {
            name: "print_type_summary('hi') mentions str",
            code: `import io, sys\n__cap = io.StringIO()\n__old = sys.stdout\nsys.stdout = __cap\nprint_type_summary("hi")\nsys.stdout = __old\n__out = __cap.getvalue()\nassert "hi" in __out and "str" in __out`,
          },
        ],
      },
      {
        id: "var_swap",
        mode: "return",
        title: "Swap two values",
        description: `
          <p>Write a function <code>swap_values(a, b)</code> that returns a tuple with the two
             values swapped: <code>(b, a)</code>.</p>
        `,
        starter: `def swap_values(a, b):
    # your code here
    return None
`,
        inputs: null,
        hints: ["Python can build a tuple directly: return b, a — no temporary variable needed."],
        solution: `def swap_values(a, b):
    return b, a
`,
        tests: [
          { name: "swap_values(1, 2) == (2, 1)", code: `assert swap_values(1, 2) == (2, 1)` },
          { name: "swap_values('x', 'y') == ('y', 'x')", code: `assert swap_values("x", "y") == ("y", "x")` },
        ],
      },
    ],
  },

  // ============================================================
  {
    id: "io",
    title: "Input & Output",
    color: "green",
    hex: "#0891b2",
    icon: "⌨️",
    lesson: {
      concept: `
        <p><code>input(prompt)</code> shows <code>prompt</code>, waits for the user to type
           something, and always returns it as a <b>string</b> — even if they typed a number.</p>
        <p>To use it as a number, wrap it in <code>int(...)</code> or <code>float(...)</code>.
           This conversion is sometimes called <b>casting</b>.</p>
        <p><code>print()</code> outputs a message. Give it several comma-separated arguments and
           Python joins them with single spaces automatically.</p>
      `,
      example: `radius = float(input("Please enter the radius of the cylinder "))
length = float(input("Please enter the length of the cylinder "))
volume = radius * radius * length * 3.142
print("Volume of the cylinder is", volume)`,
      keyPoints: [
        "input() always returns a str — cast with int() or float() before doing maths",
        "print(a, b, c) inserts a space between each argument automatically",
        "Every input() should be preceded by a clear prompt telling the user what to type",
      ],
    },
    mcqs: [
      {
        q: "What type does input() always return, before any casting?",
        options: ["int", "float", "str", "bool"],
        correct: 2,
        explain: "input() hands back exactly what the user typed, as text — you must cast it yourself.",
      },
      {
        q: "Which line correctly reads a whole number age from the user?",
        options: [
          `age = input("Age: ")`,
          `age = int(input("Age: "))`,
          `age = Integer(input("Age: "))`,
          `INPUT age`,
        ],
        correct: 1,
        explain: "int(...) converts the string returned by input() into a whole number.",
      },
      {
        q: `What does print("Total:", 5, "items") output?`,
        options: [`"Total:5items"`, `"Total: 5 items"`, `"Total, 5, items"`, "a TypeError"],
        correct: 1,
        explain: "print() inserts a single space between comma-separated arguments by default.",
      },
    ],
    exercises: [
      {
        id: "io_rectangle",
        mode: "print",
        title: "Rectangle perimeter and area",
        description: `
          <p>Read a rectangle's <code>length</code> and <code>width</code> as real numbers
             (in that order), then <code>print</code> both its perimeter and its area, each
             with a clear message.</p>
          <ul>
            <li>Perimeter = 2 &times; (length + width)</li>
            <li>Area = length &times; width</li>
          </ul>
        `,
        starter: `length = float(input("Enter length: "))
width = float(input("Enter width: "))
# calculate and output the perimeter and area
print()
`,
        inputs: ["4", "3"],
        hints: [
          "perimeter = 2 * (length + width)",
          "area = length * width",
          `Use print("Perimeter is", perimeter) style messages so the tests can find the numbers in your output.`,
        ],
        solution: `length = float(input("Enter length: "))
width = float(input("Enter width: "))
perimeter = 2 * (length + width)
area = length * width
print("Perimeter is", perimeter)
print("Area is", area)
`,
        tests: [
          { name: "output mentions the correct perimeter (14)", code: `assert "14" in __stdout` },
          { name: "output mentions the correct area (12)", code: `assert "12" in __stdout` },
        ],
      },
      {
        id: "io_greeting",
        mode: "print",
        title: "Name and age greeting",
        description: `
          <p>Read the user's <code>name</code> (string) then their <code>age</code> (integer),
             then print a single greeting message that includes both, e.g.
             <code>"Hello Ana, you are 13 years old"</code>.</p>
        `,
        starter: `name = input("What is your name? ")
age = int(input("How old are you? "))
# print a greeting that includes both
print()
`,
        inputs: ["Ana", "13"],
        hints: [
          "You can pass several values to print(), separated by commas.",
          `print("Hello", name + ", you are", age, "years old") is one way to do it.`,
        ],
        solution: `name = input("What is your name? ")
age = int(input("How old are you? "))
print("Hello", name + ", you are", age, "years old")
`,
        tests: [
          { name: "greeting includes the name", code: `assert "Ana" in __stdout` },
          { name: "greeting includes the age", code: `assert "13" in __stdout` },
        ],
      },

      {
        id: "io_bmi",
        mode: "print",
        title: "BMI calculator",
        description: `
          <p>Read a person's <code>weight</code> in kg, then their <code>height</code> in
             metres. Calculate their BMI (<code>weight / height ** 2</code>) and print it
             rounded to 1 decimal place with a clear message.</p>
        `,
        starter: `weight = float(input("Enter weight in kg: "))
height = float(input("Enter height in m: "))
# calculate and print the BMI, rounded to 1 decimal place
print()
`,
        inputs: ["70", "1.75"],
        hints: [
          "bmi = weight / height ** 2",
          `Use round(bmi, 1) before printing so the tests can find the exact value.`,
        ],
        solution: `weight = float(input("Enter weight in kg: "))
height = float(input("Enter height in m: "))
bmi = round(weight / height ** 2, 1)
print("BMI is", bmi)
`,
        tests: [
          { name: "output mentions the correct BMI (22.9)", code: `assert "22.9" in __stdout` },
        ],
      },
      {
        id: "io_cast",
        mode: "return",
        title: "Cast the inputs",
        description: `
          <p>Write a function <code>cast_inputs(age_str, price_str)</code> that takes two
             strings (as if they came from <code>input()</code>) and returns a tuple
             <code>(age, price)</code> where <code>age</code> is an <code>int</code> and
             <code>price</code> is a <code>float</code>.</p>
        `,
        starter: `def cast_inputs(age_str, price_str):
    # your code here
    return None
`,
        inputs: null,
        hints: ["age = int(age_str)", "price = float(price_str)"],
        solution: `def cast_inputs(age_str, price_str):
    age = int(age_str)
    price = float(price_str)
    return (age, price)
`,
        tests: [
          { name: "cast_inputs('13', '2.5') == (13, 2.5)", code: `assert cast_inputs("13", "2.5") == (13, 2.5)` },
          { name: "returned age is an int", code: `assert type(cast_inputs("13", "2.5")[0]) == int` },
          { name: "returned price is a float", code: `assert type(cast_inputs("13", "2.5")[1]) == float` },
        ],
      },
      {
        id: "io_receipt",
        mode: "print",
        title: "Print a receipt line",
        description: `
          <p>Read an item name, then its price. Print a receipt line in the format
             <code>"Item: Pen - $1.5"</code> (item name, then price).</p>
        `,
        starter: `item = input("Item name: ")
price = float(input("Price: "))
# print the receipt line
print()
`,
        inputs: ["Pen", "1.5"],
        hints: [`print("Item:", item, "- $" + str(price)) is one way to build this line.`],
        solution: `item = input("Item name: ")
price = float(input("Price: "))
print("Item:", item, "- $" + str(price))
`,
        tests: [
          { name: "output includes the item name", code: `assert "Pen" in __stdout` },
          { name: "output includes the price", code: `assert "1.5" in __stdout` },
        ],
      },
    ],
  },

  // ============================================================
  {
    id: "selection",
    title: "Sequence & Selection",
    color: "yellow",
    hex: "#16a34a",
    icon: "🔀",
    lesson: {
      concept: `
        <p><b>Sequence</b> just means the order your statements run in — get it wrong (e.g.
           testing a value before you've read it) and the whole program gives wrong answers.</p>
        <p><b>Selection</b> lets a program choose a path. Python uses <code>if</code>,
           <code>elif</code> ("else if") and <code>else</code> — no <code>THEN</code>,
           no <code>ENDIF</code>. Instead, a colon <code>:</code> starts the block and
           <b>indentation</b> shows what belongs inside it.</p>
      `,
      example: `age = 20

if age >= 18:
    print("You are an adult")
elif age >= 13:
    print("You are a teenager")
else:
    print("You are a child")`,
      keyPoints: [
        "if / elif / else — Python has no separate CASE/switch keyword for simple value matching",
        "A colon : opens a block; indentation (not END IF) closes it",
        "elif chains are checked top to bottom — the first true condition wins",
      ],
    },
    mcqs: [
      {
        q: `Which keyword does Python use for "else if"?`,
        options: ["elseif", "elif", "ELSE IF", "otherwise"],
        correct: 1,
        explain: "Python's keyword is elif — a contraction of 'else if'.",
      },
      {
        q: "Which snippet is valid Python?",
        options: [
          `if age > 17\n    print("adult")`,
          `if age > 17:\nprint("adult")`,
          `if age > 17:\n    print("adult")`,
          `IF age > 17 THEN print("adult") ENDIF`,
        ],
        correct: 2,
        explain: "Python needs a colon after the condition, and the body must be indented under it.",
      },
      {
        q: "In the textbook's mark-totalling example, testing IF Mark = 999 BEFORE adding it to the total caused what bug?",
        options: [
          "The average excluded a valid mark",
          "The sentinel value 999 got added into the total and counted as a mark",
          "The loop never terminated",
          "There was no bug — the order didn't matter",
        ],
        correct: 1,
        explain: "Sequence matters: the terminator 999 was totalled and counted before the loop checked for it, corrupting the total, count and average.",
      },
    ],
    exercises: [
      {
        id: "sel_adult",
        mode: "return",
        title: "Adult or child",
        description: `
          <p>Write a function <code>classify(age)</code> that returns the string
             <code>"adult"</code> if <code>age</code> is 18 or over, otherwise
             <code>"child"</code>.</p>
        `,
        starter: `def classify(age):
    # your code here
    return None
`,
        inputs: null,
        hints: [
          "Use if / else with the condition age >= 18.",
          `Return "adult" in the if branch, "child" in the else branch.`,
        ],
        solution: `def classify(age):
    if age >= 18:
        return "adult"
    else:
        return "child"
`,
        tests: [
          { name: "classify(20) == 'adult'", code: `assert classify(20) == "adult"` },
          { name: "classify(18) == 'adult' (boundary)", code: `assert classify(18) == "adult"` },
          { name: "classify(17) == 'child'", code: `assert classify(17) == "child"` },
          { name: "classify(5) == 'child'", code: `assert classify(5) == "child"` },
        ],
      },
      {
        id: "sel_grade",
        mode: "return",
        title: "Grade classifier",
        description: `
          <p>Write a function <code>grade(score)</code> that returns a letter grade using an
             <code>elif</code> chain:</p>
          <ul>
            <li>90 or above &rarr; <code>"A"</code></li>
            <li>80&ndash;89 &rarr; <code>"B"</code></li>
            <li>70&ndash;79 &rarr; <code>"C"</code></li>
            <li>60&ndash;69 &rarr; <code>"D"</code></li>
            <li>below 60 &rarr; <code>"F"</code></li>
          </ul>
        `,
        starter: `def grade(score):
    # your code here
    return None
`,
        inputs: null,
        hints: [
          "Check the highest boundary first: if score >= 90.",
          "Chain the rest with elif, and finish with a plain else for F.",
        ],
        solution: `def grade(score):
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    elif score >= 60:
        return "D"
    else:
        return "F"
`,
        tests: [
          { name: "grade(95) == 'A'", code: `assert grade(95) == "A"` },
          { name: "grade(82) == 'B'", code: `assert grade(82) == "B"` },
          { name: "grade(70) == 'C' (boundary)", code: `assert grade(70) == "C"` },
          { name: "grade(45) == 'F'", code: `assert grade(45) == "F"` },
        ],
      },

      {
        id: "sel_leapyear",
        mode: "return",
        title: "Leap year checker",
        description: `
          <p>Write a function <code>is_leap_year(year)</code> that returns <code>True</code> if
             <code>year</code> is a leap year. A year is a leap year if it's divisible by 4,
             UNLESS it's also divisible by 100 — unless it's ALSO divisible by 400.</p>
        `,
        starter: `def is_leap_year(year):
    # your code here
    return None
`,
        inputs: null,
        hints: [
          "Start with: divisible by 4 AND (not divisible by 100 OR divisible by 400).",
          "year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)",
        ],
        solution: `def is_leap_year(year):
    return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)
`,
        tests: [
          { name: "is_leap_year(2000) is True", code: `assert is_leap_year(2000) == True` },
          { name: "is_leap_year(1900) is False", code: `assert is_leap_year(1900) == False` },
          { name: "is_leap_year(2024) is True", code: `assert is_leap_year(2024) == True` },
          { name: "is_leap_year(2023) is False", code: `assert is_leap_year(2023) == False` },
        ],
      },
      {
        id: "sel_ticket",
        mode: "return",
        title: "Cinema ticket price",
        description: `
          <p>Write a function <code>ticket_price(age)</code> that returns the ticket price:</p>
          <ul>
            <li>under 5 &rarr; <code>0</code> (free)</li>
            <li>5 to 17 &rarr; <code>5</code></li>
            <li>65 or over &rarr; <code>6</code></li>
            <li>everyone else &rarr; <code>10</code></li>
          </ul>
        `,
        starter: `def ticket_price(age):
    # your code here
    return None
`,
        inputs: null,
        hints: ["Check the youngest and oldest special cases first, then fall through to the adult price."],
        solution: `def ticket_price(age):
    if age < 5:
        return 0
    elif age < 18:
        return 5
    elif age >= 65:
        return 6
    else:
        return 10
`,
        tests: [
          { name: "ticket_price(3) == 0", code: `assert ticket_price(3) == 0` },
          { name: "ticket_price(10) == 5", code: `assert ticket_price(10) == 5` },
          { name: "ticket_price(70) == 6", code: `assert ticket_price(70) == 6` },
          { name: "ticket_price(30) == 10", code: `assert ticket_price(30) == 10` },
        ],
      },
      {
        id: "sel_traffic",
        mode: "print",
        title: "Traffic light action",
        description: `
          <p>Write a function <code>traffic_action(color)</code> that prints
             <code>"STOP"</code> for <code>"red"</code>, <code>"READY"</code> for
             <code>"amber"</code>, and <code>"GO"</code> for <code>"green"</code>.</p>
        `,
        starter: `def traffic_action(color):
    # your code here
    print()
`,
        inputs: null,
        hints: ["Use if / elif / else to check color against each string."],
        solution: `def traffic_action(color):
    if color == "red":
        print("STOP")
    elif color == "amber":
        print("READY")
    else:
        print("GO")
`,
        tests: [
          {
            name: "traffic_action('red') prints STOP",
            code: `import io, sys\n__cap = io.StringIO()\n__old = sys.stdout\nsys.stdout = __cap\ntraffic_action("red")\nsys.stdout = __old\nassert "STOP" in __cap.getvalue()`,
          },
          {
            name: "traffic_action('green') prints GO",
            code: `import io, sys\n__cap = io.StringIO()\n__old = sys.stdout\nsys.stdout = __cap\ntraffic_action("green")\nsys.stdout = __old\nassert "GO" in __cap.getvalue()`,
          },
        ],
      },
    ],
  },

  // ============================================================
  {
    id: "forloop",
    title: "For Loop",
    color: "purple",
    hex: "#dc2626",
    icon: "🔁",
    lesson: {
      concept: `
        <p>A <b>for loop</b> is Python's <b>count-controlled</b> loop — use it whenever you know
           in advance how many times something should repeat.</p>
        <p><code>for x in range(start, stop, step):</code> counts from <code>start</code> up to
           (but NOT including) <code>stop</code>, moving by <code>step</code> each time.</p>
        <p>Loops can also be <b>nested</b> — one loop inside another — for example, an outer loop
           over rows and an inner loop over the values in each row. The inner loop runs to
           completion for every single pass of the outer loop.</p>
      `,
      example: `# counter goes 1, 3, 5, 7, 9 (range(start, stop, step))
for counter in range(1, 11, 2):
    print(counter)

# nested loop: 3 rows of stars, growing each row
for row in range(1, 4):
    for star in range(row):
        print("*", end="")
    print()`,
      keyPoints: [
        "range(start, stop, step) — stop is EXCLUDED, so range(1, 11) goes up to 10",
        "range(n) alone counts from 0 up to n-1 — Python indexes from 0",
        "Use a for loop when you know the exact number of repetitions in advance",
        "A nested loop's inner loop finishes completely for every single pass of the outer loop",
      ],
    },
    mcqs: [
      {
        q: "What values does range(1, 11, 2) produce?",
        options: ["1, 3, 5, 7, 9, 11", "1, 3, 5, 7, 9", "2, 4, 6, 8, 10", "1, 2, 3, ..., 10"],
        correct: 1,
        explain: "range's stop value (11) is never included, so the sequence stops at 9.",
      },
      {
        q: "In a nested loop with an outer loop of 3 passes and an inner loop of 4 passes, how many times does the innermost line run in total?",
        options: ["3", "4", "7", "12"],
        correct: 3,
        explain: "The inner loop runs fully (4 times) for every single pass of the outer loop: 3 x 4 = 12.",
      },
      {
        q: "Which situation is a for loop best suited for?",
        options: [
          "Repeating something exactly 10 times",
          "Repeating until the user types 'quit'",
          "Repeating an unknown number of times until a password matches",
          "Running some code only once",
        ],
        correct: 0,
        explain: "for loops are count-controlled — perfect when you know the exact number of repetitions up front.",
      },
    ],
    exercises: [
      {
        id: "iter_sumton",
        mode: "return",
        title: "Sum 1 to N",
        description: `
          <p>Write a function <code>sum_to_n(n)</code> that adds up every whole number from
             1 to <code>n</code> inclusive <b>using a for loop</b> (not a maths shortcut).</p>
        `,
        starter: `def sum_to_n(n):
    total = 0
    # your loop here
    return total
`,
        inputs: null,
        hints: [
          "Loop with for i in range(1, n + 1):",
          "Add i to total on every pass: total = total + i",
        ],
        solution: `def sum_to_n(n):
    total = 0
    for i in range(1, n + 1):
        total += i
    return total
`,
        tests: [
          { name: "sum_to_n(5) == 15", code: `assert sum_to_n(5) == 15` },
          { name: "sum_to_n(1) == 1", code: `assert sum_to_n(1) == 1` },
          { name: "sum_to_n(10) == 55", code: `assert sum_to_n(10) == 55` },
        ],
      },
      {
        id: "iter_triangle",
        mode: "print",
        title: "Star triangle (nested loops)",
        description: `
          <p>Write a function <code>print_triangle(n)</code> that prints <code>n</code> rows of
             stars: row 1 has one star, row 2 has two stars, and so on up to row <code>n</code>.
             Use one loop <i>inside</i> another.</p>
          <p>For <code>print_triangle(3)</code> the output should be:</p>
          <pre class="code">*
**
***</pre>
        `,
        starter: `def print_triangle(n):
    # your nested loop here
    print()
`,
        inputs: null,
        hints: [
          "Outer loop: for row in range(1, n + 1): — this picks how many stars go on each row.",
          `Inner loop: for star in range(row): print("*", end="") — end="" stops it from starting a new line each star.`,
          "After the inner loop finishes, print() with no arguments starts a new line for the next row.",
        ],
        solution: `def print_triangle(n):
    for row in range(1, n + 1):
        for star in range(row):
            print("*", end="")
        print()
`,
        tests: [
          {
            name: "print_triangle(3) prints the right shape",
            code: `import io, sys\n__cap = io.StringIO()\n__old = sys.stdout\nsys.stdout = __cap\nprint_triangle(3)\nsys.stdout = __old\n__out = __cap.getvalue()\nassert [l for l in __out.split("\\n") if l] == ["*", "**", "***"]`,
          },
        ],
      },
      {
        id: "iter_factorial",
        mode: "return",
        title: "Factorial",
        description: `
          <p>Write a function <code>factorial(n)</code> that returns <code>n!</code>
             (<code>n &times; (n-1) &times; ... &times; 1</code>) using a <code>for</code> loop.
             <code>factorial(0)</code> should be <code>1</code>.</p>
        `,
        starter: `def factorial(n):
    result = 1
    # your loop here
    return result
`,
        inputs: null,
        hints: ["Loop with for i in range(1, n + 1):", "Multiply result by i each time: result *= i"],
        solution: `def factorial(n):
    result = 1
    for i in range(1, n + 1):
        result *= i
    return result
`,
        tests: [
          { name: "factorial(0) == 1", code: `assert factorial(0) == 1` },
          { name: "factorial(1) == 1", code: `assert factorial(1) == 1` },
          { name: "factorial(5) == 120", code: `assert factorial(5) == 120` },
        ],
      },
      {
        id: "iter_sumevens",
        mode: "return",
        title: "Sum of even numbers",
        description: `
          <p>Write a function <code>sum_evens(n)</code> that returns the sum of every even
             number from 1 to <code>n</code> inclusive, using a <code>for</code> loop.</p>
        `,
        starter: `def sum_evens(n):
    total = 0
    # your loop here
    return total
`,
        inputs: null,
        hints: [
          "Loop with for i in range(1, n + 1):",
          "Inside the loop, check if i % 2 == 0 before adding it to total.",
        ],
        solution: `def sum_evens(n):
    total = 0
    for i in range(1, n + 1):
        if i % 2 == 0:
            total += i
    return total
`,
        tests: [
          { name: "sum_evens(10) == 30", code: `assert sum_evens(10) == 30` },
          { name: "sum_evens(1) == 0", code: `assert sum_evens(1) == 0` },
        ],
      },
      {
        id: "for_reverserange",
        mode: "print",
        title: "Print a range backwards",
        description: `
          <p>Write a function <code>print_reverse_range(n)</code> that prints every number from
             <code>n</code> down to <code>1</code> (one per line), <b>using a for loop with a
             negative step</b> — not a while loop.</p>
        `,
        starter: `def print_reverse_range(n):
    # your for loop here (use range with a negative step)
    print()
`,
        inputs: null,
        hints: [
          "range(n, 0, -1) counts down from n to 1.",
          "for i in range(n, 0, -1): print(i)",
        ],
        solution: `def print_reverse_range(n):
    for i in range(n, 0, -1):
        print(i)
`,
        tests: [
          {
            name: "print_reverse_range(4) prints 4, 3, 2, 1",
            code: `import io, sys\n__cap = io.StringIO()\n__old = sys.stdout\nsys.stdout = __cap\nprint_reverse_range(4)\nsys.stdout = __old\n__lines = [l for l in __cap.getvalue().split("\\n") if l]\nassert __lines == ["4", "3", "2", "1"]`,
          },
        ],
      },
    ],
  },

  // ============================================================
  {
    id: "whileloop",
    title: "While Loop",
    color: "teal",
    hex: "#14b8a6",
    icon: "⏳",
    lesson: {
      concept: `
        <p>A <b>while loop</b> is Python's <b>condition-controlled</b> loop — use it when you
           <i>don't</i> know in advance how many times something should repeat, only the
           condition that should stop it.</p>
        <p><code>while condition:</code> checks its condition <b>before</b> every pass, so it's a
           <b>pre-condition</b> loop — it might run zero times if the condition starts out
           false.</p>
        <p>Python has <b>no built-in post-condition loop</b> (no <code>do...while</code>, no
           <code>REPEAT...UNTIL</code>). To guarantee at least one run, use
           <code>while True:</code> with a <code>break</code> inside.</p>
      `,
      example: `# pre-condition: may run zero times
total_weight = 0
while total_weight < 100:
    total_weight += 25

# simulating a post-condition (REPEAT...UNTIL) loop:
# always runs at least once, exits on break
mark = None
while True:
    mark = int(input("Enter mark, 999 to finish: "))
    if mark == 999:
        break
    print("Got", mark)`,
      keyPoints: [
        "while checks its condition BEFORE each pass — it can run zero times",
        "Every while loop needs something inside it that eventually makes the condition False — forget that, and it never stops",
        "Python has no do/while — simulate a post-condition loop with while True: ... break",
        "Use a while loop when the number of repeats depends on data, not a fixed count",
      ],
    },
    mcqs: [
      {
        q: "Which loop type does Python NOT provide a dedicated keyword for?",
        options: ["Count-controlled (for)", "Pre-condition (while)", "Post-condition (do...while / REPEAT...UNTIL)", "None — Python has all three"],
        correct: 2,
        explain: "Python only has for and while; a post-condition loop needs while True: with a break.",
      },
      {
        q: "What happens if a while loop's condition is False from the very start?",
        options: ["It runs once, then stops", "It runs forever", "The loop body never runs at all", "Python raises an error"],
        correct: 2,
        explain: "while is a pre-condition loop — it checks first, so a false condition means the body is skipped entirely.",
      },
      {
        q: "What's the most common cause of an infinite while loop?",
        options: [
          "Using range() instead of a plain number",
          "Forgetting to update the variable the condition depends on",
          "Using too many spaces for indentation",
          "Calling a function inside the loop",
        ],
        correct: 1,
        explain: "If nothing inside the loop changes the value the condition checks, that condition can never become False.",
      },
    ],
    exercises: [
      {
        id: "iter_countdown",
        mode: "print",
        title: "Countdown",
        description: `
          <p>Write a function <code>countdown(n)</code> that prints every number from
             <code>n</code> down to <code>1</code> (one per line), then prints
             <code>"Liftoff!"</code>. Use a <code>while</code> loop.</p>
        `,
        starter: `def countdown(n):
    # your while loop here
    print()
`,
        inputs: null,
        hints: [
          "while n > 0: print(n) then n -= 1",
          `After the loop ends, print("Liftoff!")`,
        ],
        solution: `def countdown(n):
    while n > 0:
        print(n)
        n -= 1
    print("Liftoff!")
`,
        tests: [
          {
            name: "countdown(3) counts down and says Liftoff!",
            code: `import io, sys\n__cap = io.StringIO()\n__old = sys.stdout\nsys.stdout = __cap\ncountdown(3)\nsys.stdout = __old\n__lines = [l for l in __cap.getvalue().split("\\n") if l]\nassert __lines == ["3", "2", "1", "Liftoff!"]`,
          },
        ],
      },
      {
        id: "while_sumuntilnegative",
        mode: "return",
        title: "Sum until a negative number",
        description: `
          <p>Write a function <code>sum_until_stop(values)</code> that adds up numbers from the
             list <code>values</code> in order, <b>stopping as soon as it reaches a negative
             number</b> (the negative number itself is not added). Use a <code>while</code>
             loop, not a for loop.</p>
        `,
        starter: `def sum_until_stop(values):
    total = 0
    i = 0
    # your while loop here
    return total
`,
        inputs: null,
        hints: [
          "The while condition needs two parts: i < len(values) AND values[i] >= 0.",
          "Inside the loop: total += values[i], then i += 1.",
        ],
        solution: `def sum_until_stop(values):
    total = 0
    i = 0
    while i < len(values) and values[i] >= 0:
        total += values[i]
        i += 1
    return total
`,
        tests: [
          { name: "sum_until_stop([1, 2, 3, -1, 5]) == 6", code: `assert sum_until_stop([1, 2, 3, -1, 5]) == 6` },
          { name: "sum_until_stop([-1, 2]) == 0", code: `assert sum_until_stop([-1, 2]) == 0` },
        ],
      },
      {
        id: "while_doubleuntil",
        mode: "return",
        title: "Smallest power of two",
        description: `
          <p>Write a function <code>first_power_of_two_over(limit)</code> that starts at
             <code>1</code> and keeps doubling until the value is greater than or equal to
             <code>limit</code>, then returns that value. Use a <code>while</code> loop.</p>
        `,
        starter: `def first_power_of_two_over(limit):
    value = 1
    # your while loop here
    return value
`,
        inputs: null,
        hints: ["while value < limit: value *= 2"],
        solution: `def first_power_of_two_over(limit):
    value = 1
    while value < limit:
        value *= 2
    return value
`,
        tests: [
          { name: "first_power_of_two_over(10) == 16", code: `assert first_power_of_two_over(10) == 16` },
          { name: "first_power_of_two_over(1) == 1", code: `assert first_power_of_two_over(1) == 1` },
        ],
      },
      {
        id: "while_collatzsteps",
        mode: "return",
        title: "Collatz steps",
        description: `
          <p>Write a function <code>collatz_steps(n)</code> that counts how many steps it takes
             to reach 1 using the Collatz rule: if <code>n</code> is even, halve it
             (<code>n // 2</code>); if odd, do <code>3 * n + 1</code>. Repeat until
             <code>n == 1</code>, counting each step.</p>
        `,
        starter: `def collatz_steps(n):
    steps = 0
    # your while loop here
    return steps
`,
        inputs: null,
        hints: [
          "while n != 1: check if n is even or odd, apply the matching rule, then steps += 1.",
        ],
        solution: `def collatz_steps(n):
    steps = 0
    while n != 1:
        if n % 2 == 0:
            n = n // 2
        else:
            n = 3 * n + 1
        steps += 1
    return steps
`,
        tests: [
          { name: "collatz_steps(6) == 8", code: `assert collatz_steps(6) == 8` },
          { name: "collatz_steps(1) == 0", code: `assert collatz_steps(1) == 0` },
        ],
      },
      {
        id: "while_passwordattempts",
        mode: "print",
        title: "Password attempts",
        description: `
          <p>Write a function <code>login_attempts(correct_password)</code> that keeps asking
             for a password with <code>input()</code> until it matches
             <code>correct_password</code>, then prints how many attempts it took, e.g.
             <code>"Access granted after 3 attempts"</code>.</p>
        `,
        starter: `def login_attempts(correct_password):
    # your while loop here
    print()


login_attempts("secret")
`,
        inputs: ["wrong", "wrong", "secret"],
        hints: [
          "Read the first guess and count it before the loop, then use while guess != correct_password: to keep asking.",
        ],
        solution: `def login_attempts(correct_password):
    attempts = 0
    guess = input("Enter password: ")
    attempts += 1
    while guess != correct_password:
        guess = input("Enter password: ")
        attempts += 1
    print("Access granted after", attempts, "attempts")


login_attempts("secret")
`,
        tests: [
          { name: "reports 3 attempts for the sample inputs", code: `assert "3" in __stdout and "Access granted" in __stdout` },
        ],
      },
    ],
  },

  // ============================================================
  {
    id: "totalling",
    title: "Totalling & Counting",
    color: "red",
    hex: "#d97706",
    icon: "➕",
    lesson: {
      concept: `
        <p><b>Totalling</b> builds up a running sum: <code>total = total + value</code>
           (or <code>total += value</code>). <b>Counting</b> builds up a running count:
           <code>count = count + 1</code> (or <code>count += 1</code>).</p>
        <p>Both must start at <b>0 before the loop</b>. Getting the order of statements wrong
           inside the loop — like testing for a sentinel value <i>after</i> already totalling
           and counting it — silently corrupts the result, as the textbook's marks example shows.</p>
      `,
      example: `total = 0
count = 0

print("Enter marks, 999 to finish")
mark = int(input())
while mark != 999:
    total += mark
    count += 1
    mark = int(input())

print("Total:", total)
print("Count:", count)
print("Average:", total / count)`,
      keyPoints: [
        "Always initialise total = 0 and count = 0 before the loop starts",
        "Check the sentinel value BEFORE totalling/counting it, or you'll pollute your results",
        "Average = total / count — only valid once count > 0",
      ],
    },
    mcqs: [
      {
        q: "Which line correctly increments a counter?",
        options: ["count =+ 1", "count += 1", "count ++", "INCREMENT count"],
        correct: 1,
        explain: "+= is Python's compound-assignment operator; =+ is a typo that just re-assigns +1.",
      },
      {
        q: "In the textbook's REPEAT...UNTIL marks example, why did the first version give the wrong total?",
        options: [
          "It totalled and counted the 999 sentinel before checking for it",
          "It forgot to declare the Total variable",
          "It used the wrong loop type",
          "999 is not a valid integer",
        ],
        correct: 0,
        explain: "The sentinel got added into the running total and count before the loop's exit check ran.",
      },
      {
        q: `"Total = Total + Mark" inside a loop is an example of...`,
        options: ["Selection", "Totalling", "Counting", "Casting"],
        correct: 1,
        explain: "Building up a running sum from repeated values is the definition of totalling.",
      },
    ],
    exercises: [
      {
        id: "tot_average",
        mode: "return",
        title: "Total and average of a list",
        description: `
          <p>Write a function <code>total_and_average(marks)</code> that returns a tuple
             <code>(total, average)</code> for a list of numbers, calculated with a loop that
             totals and counts as it goes (don't use Python's built-in <code>sum()</code>).</p>
        `,
        starter: `def total_and_average(marks):
    total = 0
    count = 0
    # your loop here
    average = total / count
    return (total, average)
`,
        inputs: null,
        hints: [
          "Loop with for mark in marks:",
          "Inside the loop: total += mark and count += 1",
        ],
        solution: `def total_and_average(marks):
    total = 0
    count = 0
    for mark in marks:
        total += mark
        count += 1
    average = total / count
    return (total, average)
`,
        tests: [
          { name: "total_and_average([25, 27, 23]) totals correctly", code: `assert total_and_average([25, 27, 23])[0] == 75` },
          { name: "total_and_average([25, 27, 23]) averages correctly", code: `assert abs(total_and_average([25, 27, 23])[1] - 25) < 0.001` },
        ],
      },
      {
        id: "tot_sentinel",
        mode: "print",
        title: "Sentinel-controlled totalling",
        description: `
          <p>Just like the textbook's worked example: repeatedly read a mark from the user.
             When they type <code>"999"</code>, stop — <b>without</b> adding 999 to the total or
             counting it. Then print the total and the count.</p>
        `,
        starter: `total = 0
count = 0

mark = int(input("Enter marks, 999 to finish "))
# your loop here

print("Total:", total)
print("Count:", count)
`,
        inputs: ["25", "27", "23", "999"],
        hints: [
          "Use while mark != 999: as the loop condition, checked BEFORE totalling.",
          "Inside the loop: total += mark, count += 1, then read the next mark again.",
        ],
        solution: `total = 0
count = 0

mark = int(input("Enter marks, 999 to finish "))
while mark != 999:
    total += mark
    count += 1
    mark = int(input("Enter marks, 999 to finish "))

print("Total:", total)
print("Count:", count)
`,
        tests: [
          { name: "total excludes the 999 sentinel", code: `assert "75" in __stdout` },
          { name: "count is 3, not 4", code: `assert "Count: 3" in __stdout or "Count:3" in __stdout` },
        ],
      },

      {
        id: "tot_countpositive",
        mode: "return",
        title: "Count positive numbers",
        description: `
          <p>Write a function <code>count_positive(values)</code> that returns how many numbers
             in the list <code>values</code> are greater than 0, using a loop.</p>
        `,
        starter: `def count_positive(values):
    count = 0
    # your loop here
    return count
`,
        inputs: null,
        hints: ["Loop with for value in values:", "If value > 0, add 1 to count."],
        solution: `def count_positive(values):
    count = 0
    for value in values:
        if value > 0:
            count += 1
    return count
`,
        tests: [
          { name: "count_positive([1, -2, 3, -4, 5]) == 3", code: `assert count_positive([1, -2, 3, -4, 5]) == 3` },
          { name: "count_positive([]) == 0", code: `assert count_positive([]) == 0` },
        ],
      },
      {
        id: "tot_runningtotal",
        mode: "print",
        title: "Running total",
        description: `
          <p>Write a function <code>print_running_total(values)</code> that prints the running
             (cumulative) total after adding each value, one line per value.</p>
          <p>For <code>[10, 20, 5]</code> it should print <code>10</code>, then
             <code>30</code>, then <code>35</code>.</p>
        `,
        starter: `def print_running_total(values):
    total = 0
    # your loop here
print()
`,
        inputs: null,
        hints: ["Inside the loop: total += value, then print(total)."],
        solution: `def print_running_total(values):
    total = 0
    for value in values:
        total += value
        print(total)
`,
        tests: [
          {
            name: "print_running_total([10, 20, 5]) prints the correct running totals",
            code: `import io, sys\n__cap = io.StringIO()\n__old = sys.stdout\nsys.stdout = __cap\nprint_running_total([10, 20, 5])\nsys.stdout = __old\n__lines = [l for l in __cap.getvalue().split("\\n") if l]\nassert __lines == ["10", "30", "35"]`,
          },
        ],
      },
      {
        id: "tot_findmax",
        mode: "return",
        title: "Find the maximum",
        description: `
          <p>Write a function <code>find_max(values)</code> that returns the largest number in
             the list <code>values</code>, using a loop (not the built-in <code>max()</code>).
             Assume the list is never empty.</p>
        `,
        starter: `def find_max(values):
    largest = values[0]
    # your loop here
    return largest
`,
        inputs: null,
        hints: [
          "Loop with for value in values:",
          "If value > largest, update largest = value.",
        ],
        solution: `def find_max(values):
    largest = values[0]
    for value in values:
        if value > largest:
            largest = value
    return largest
`,
        tests: [
          { name: "find_max([3, 9, 2]) == 9", code: `assert find_max([3, 9, 2]) == 9` },
          { name: "find_max([5]) == 5", code: `assert find_max([5]) == 5` },
        ],
      },
    ],
  },

  // ============================================================
  {
    id: "strings",
    title: "String Handling",
    color: "orange",
    hex: "#db2777",
    icon: "🔤",
    lesson: {
      concept: `
        <p>Python treats a string as a sequence of characters, indexed from <b>0</b> (the
           textbook's pseudocode indexes from 1 — watch out when translating between them).</p>
        <p>The four IGCSE string methods you need:</p>
        <ul>
          <li><code>len(s)</code> — number of characters</li>
          <li><code>s[start:end]</code> — slice out a substring (end is excluded)</li>
          <li><code>s.upper()</code> — all-uppercase copy</li>
          <li><code>s.lower()</code> — all-lowercase copy</li>
        </ul>
      `,
      example: `name = "Computer Science"
print(len(name))          # 16
print(name[0:8])          # "Computer"  (index 0 up to, not including, 8)
print(name.upper())       # "COMPUTER SCIENCE"
print(name.lower())       # "computer science"`,
      keyPoints: [
        "Python string indices start at 0, unlike the textbook's pseudocode (starts at 1)",
        "s[a:b] includes character a up to but NOT including character b",
        "Strings are immutable — .upper()/.lower() return a NEW string, they don't change s",
      ],
    },
    mcqs: [
      {
        q: `What does len("Computer Science") equal?`,
        options: ["15", "16", "17", "8"],
        correct: 1,
        explain: "Computer Science has 16 characters including the space.",
      },
      {
        q: `What does "Computer Science"[0:8] return?`,
        options: ["Computer", "Computer ", "omputer", "ComputerS"],
        correct: 0,
        explain: `Indices 0 to 7 spell "Computer" — index 8 (the space) is excluded.`,
      },
      {
        q: "Python string indices start at...",
        options: ["-1", "0", "1", "It depends on the string"],
        correct: 1,
        explain: "Unlike the IGCSE pseudocode (position 1), Python always starts counting at 0.",
      },
    ],
    exercises: [
      {
        id: "str_analyzer",
        mode: "return",
        title: "Name analyzer",
        description: `
          <p>Write a function <code>analyze_name(name)</code> that returns a tuple of
             <code>(length, first_three, upper, lower)</code> — the string's length, its first
             three characters, an uppercase copy, and a lowercase copy.</p>
        `,
        starter: `def analyze_name(name):
    # your code here
    return None
`,
        inputs: null,
        hints: [
          "length = len(name)",
          "first_three = name[0:3]",
          "upper = name.upper() and lower = name.lower()",
        ],
        solution: `def analyze_name(name):
    length = len(name)
    first_three = name[0:3]
    upper = name.upper()
    lower = name.lower()
    return (length, first_three, upper, lower)
`,
        tests: [
          { name: "analyze_name('Daichi') length", code: `assert analyze_name("Daichi")[0] == 6` },
          { name: "analyze_name('Daichi') first three", code: `assert analyze_name("Daichi")[1] == "Dai"` },
          { name: "analyze_name('Daichi') upper", code: `assert analyze_name("Daichi")[2] == "DAICHI"` },
          { name: "analyze_name('Daichi') lower", code: `assert analyze_name("Daichi")[3] == "daichi"` },
        ],
      },
      {
        id: "str_domain",
        mode: "return",
        title: "Extract the email domain",
        description: `
          <p>Write a function <code>extract_domain(email)</code> that returns everything after
             the <code>@</code> symbol. For example, <code>"ana@school.edu"</code> should
             give back <code>"school.edu"</code>.</p>
        `,
        starter: `def extract_domain(email):
    # your code here
    return None
`,
        inputs: null,
        hints: [
          "String .find('@') returns the index position of the @ symbol.",
          "Slice from one position after that index to the end: email[position+1:]",
        ],
        solution: `def extract_domain(email):
    position = email.find("@")
    return email[position + 1:]
`,
        tests: [
          { name: "extract_domain('ana@school.edu')", code: `assert extract_domain("ana@school.edu") == "school.edu"` },
          { name: "extract_domain('bob@gmail.com')", code: `assert extract_domain("bob@gmail.com") == "gmail.com"` },
        ],
      },

      {
        id: "str_reverse",
        mode: "return",
        title: "Reverse a string",
        description: `
          <p>Write a function <code>reverse_string(s)</code> that returns <code>s</code>
             reversed, using slicing.</p>
        `,
        starter: `def reverse_string(s):
    # your code here
    return None
`,
        inputs: null,
        hints: [`Python's extended slice s[::-1] reverses a sequence.`],
        solution: `def reverse_string(s):
    return s[::-1]
`,
        tests: [
          { name: "reverse_string('abc') == 'cba'", code: `assert reverse_string("abc") == "cba"` },
          { name: "reverse_string('Python') == 'nohtyP'", code: `assert reverse_string("Python") == "nohtyP"` },
        ],
      },
      {
        id: "str_countvowels",
        mode: "return",
        title: "Count the vowels",
        description: `
          <p>Write a function <code>count_vowels(s)</code> that returns how many vowels
             (<code>a, e, i, o, u</code> — either case) are in the string <code>s</code>, using
             a loop.</p>
        `,
        starter: `def count_vowels(s):
    count = 0
    # your loop here
    return count
`,
        inputs: null,
        hints: [
          `Loop with for ch in s.lower(): so you only need to check lowercase vowels.`,
          `if ch in "aeiou": count += 1`,
        ],
        solution: `def count_vowels(s):
    count = 0
    for ch in s.lower():
        if ch in "aeiou":
            count += 1
    return count
`,
        tests: [
          { name: "count_vowels('Computer Science') == 6", code: `assert count_vowels("Computer Science") == 6` },
          { name: "count_vowels('xyz') == 0", code: `assert count_vowels("xyz") == 0` },
        ],
      },
      {
        id: "str_initials",
        mode: "print",
        title: "Print initials",
        description: `
          <p>Write a function <code>print_initials(full_name)</code> that prints the initials
             of a full name, one letter per word, joined by dots — e.g.
             <code>"Daichi Yamamoto"</code> should print <code>"D.Y."</code>.</p>
        `,
        starter: `def print_initials(full_name):
    # your code here
    print()
`,
        inputs: null,
        hints: [
          "full_name.split() splits the name into a list of words.",
          "Loop over the words, take word[0] (the first letter) from each, and build up a string.",
        ],
        solution: `def print_initials(full_name):
    words = full_name.split()
    initials = ""
    for word in words:
        initials += word[0].upper() + "."
    print(initials)
`,
        tests: [
          {
            name: "print_initials('Daichi Yamamoto') prints D.Y.",
            code: `import io, sys\n__cap = io.StringIO()\n__old = sys.stdout\nsys.stdout = __cap\nprint_initials("Daichi Yamamoto")\nsys.stdout = __old\nassert "D.Y." in __cap.getvalue()`,
          },
        ],
      },
    ],
  },

  // ============================================================
  {
    id: "operators",
    title: "Operators",
    color: "blue",
    hex: "#2563eb",
    icon: "⚖️",
    lesson: {
      concept: `
        <p><b>Arithmetic</b> operators do maths: <code>+ - * / ** % //</code>. Note
           <code>%</code> gives the <b>remainder</b> (MOD) and <code>//</code> gives the
           <b>whole-number quotient</b> (DIV), throwing away any remainder.</p>
        <p><b>Logical (comparison)</b> operators compare two values and give a Boolean result:
           <code>&gt; &lt; == &gt;= &lt;= !=</code>. Note Python uses <code>==</code> to test
           equality — a single <code>=</code> is assignment.</p>
        <p><b>Boolean</b> operators combine True/False values: <code>and</code>, <code>or</code>,
           <code>not</code>.</p>
      `,
      example: `print(7 / 2)     # 3.5   (true division)
print(7 // 2)    # 3     (DIV — quotient, no remainder)
print(7 % 2)     # 1     (MOD — remainder)
print(2 ** 3)    # 8     (raise to the power)

age = 20
print(age >= 18 and age < 65)   # True and True -> True
print(age < 13 or age > 100)    # False or False -> False
print(not (age == 20))          # not True -> False`,
      keyPoints: [
        "// is DIV (whole-number quotient); % is MOD (remainder)",
        "== tests equality; = assigns a value — mixing these up is a classic bug",
        "and needs BOTH sides True; or needs AT LEAST ONE side True; not flips a Boolean",
      ],
    },
    mcqs: [
      {
        q: "What does 7 // 2 equal?",
        options: ["3.5", "3", "1", "4"],
        correct: 1,
        explain: "// is integer (DIV) division — it drops the remainder, giving 3.",
      },
      {
        q: "What does 7 % 2 equal?",
        options: ["3.5", "3", "1", "0"],
        correct: 2,
        explain: "% is the MOD operator — 7 divided by 2 is 3 remainder 1.",
      },
      {
        q: "Which Boolean operator requires BOTH sides to be True?",
        options: ["or", "and", "not", "=="],
        correct: 1,
        explain: "and only evaluates to True when both operands are True.",
      },
    ],
    exercises: [
      {
        id: "op_compare",
        mode: "return",
        title: "Compare three numbers",
        description: `
          <p>Write a function <code>largest_of_three(a, b, c)</code> that returns whichever of
             the three numbers is largest, using comparison operators (not the built-in
             <code>max()</code>).</p>
        `,
        starter: `def largest_of_three(a, b, c):
    # your code here
    return None
`,
        inputs: null,
        hints: [
          "Start by assuming a is the largest, store it in a variable.",
          "Compare that variable against b, then against c, updating it if you find something bigger.",
        ],
        solution: `def largest_of_three(a, b, c):
    largest = a
    if b > largest:
        largest = b
    if c > largest:
        largest = c
    return largest
`,
        tests: [
          { name: "largest_of_three(3, 9, 5) == 9", code: `assert largest_of_three(3, 9, 5) == 9` },
          { name: "largest_of_three(10, 2, 7) == 10", code: `assert largest_of_three(10, 2, 7) == 10` },
          { name: "largest_of_three(1, 2, 8) == 8", code: `assert largest_of_three(1, 2, 8) == 8` },
        ],
      },
      {
        id: "op_divmod",
        mode: "return",
        title: "Divmod calculator",
        description: `
          <p>Write a function <code>divmod_report(a, b)</code> that returns a tuple
             <code>(quotient, remainder)</code> using <code>//</code> and <code>%</code>.</p>
        `,
        starter: `def divmod_report(a, b):
    # your code here
    return None
`,
        inputs: null,
        hints: ["quotient = a // b", "remainder = a % b"],
        solution: `def divmod_report(a, b):
    quotient = a // b
    remainder = a % b
    return (quotient, remainder)
`,
        tests: [
          { name: "divmod_report(10, 3) == (3, 1)", code: `assert divmod_report(10, 3) == (3, 1)` },
          { name: "divmod_report(20, 4) == (5, 0)", code: `assert divmod_report(20, 4) == (5, 0)` },
        ],
      },

      {
        id: "op_iseven",
        mode: "return",
        title: "Is it even?",
        description: `
          <p>Write a function <code>is_even(n)</code> that returns <code>True</code> if
             <code>n</code> is even, <code>False</code> otherwise, using the <code>%</code>
             operator.</p>
        `,
        starter: `def is_even(n):
    # your code here
    return None
`,
        inputs: null,
        hints: ["A number is even if n % 2 == 0."],
        solution: `def is_even(n):
    return n % 2 == 0
`,
        tests: [
          { name: "is_even(4) is True", code: `assert is_even(4) == True` },
          { name: "is_even(7) is False", code: `assert is_even(7) == False` },
        ],
      },
      {
        id: "op_bmicategory",
        mode: "print",
        title: "BMI category",
        description: `
          <p>Write a function <code>print_bmi_category(bmi)</code> that prints:</p>
          <ul>
            <li><code>"Underweight"</code> if bmi is below 18.5</li>
            <li><code>"Normal"</code> if bmi is 18.5 up to (and including) 24.9 — use
                <code>and</code> to combine both bounds</li>
            <li><code>"Overweight"</code> if bmi is 25 or above</li>
          </ul>
        `,
        starter: `def print_bmi_category(bmi):
    # your code here
    print()
`,
        inputs: null,
        hints: [`Normal needs BOTH bmi >= 18.5 and bmi <= 24.9 — combine them with and.`],
        solution: `def print_bmi_category(bmi):
    if bmi < 18.5:
        print("Underweight")
    elif bmi >= 18.5 and bmi <= 24.9:
        print("Normal")
    else:
        print("Overweight")
`,
        tests: [
          {
            name: "print_bmi_category(17) prints Underweight",
            code: `import io, sys\n__cap = io.StringIO()\n__old = sys.stdout\nsys.stdout = __cap\nprint_bmi_category(17)\nsys.stdout = __old\nassert "Underweight" in __cap.getvalue()`,
          },
          {
            name: "print_bmi_category(22) prints Normal",
            code: `import io, sys\n__cap = io.StringIO()\n__old = sys.stdout\nsys.stdout = __cap\nprint_bmi_category(22)\nsys.stdout = __old\nassert "Normal" in __cap.getvalue()`,
          },
          {
            name: "print_bmi_category(30) prints Overweight",
            code: `import io, sys\n__cap = io.StringIO()\n__old = sys.stdout\nsys.stdout = __cap\nprint_bmi_category(30)\nsys.stdout = __old\nassert "Overweight" in __cap.getvalue()`,
          },
        ],
      },
      {
        id: "op_power",
        mode: "return",
        title: "Power calculator",
        description: `
          <p>Write a function <code>power(base, exponent)</code> that returns
             <code>base</code> raised to <code>exponent</code>, using the <code>**</code>
             operator.</p>
        `,
        starter: `def power(base, exponent):
    # your code here
    return None
`,
        inputs: null,
        hints: [`Python's ** operator raises to a power: base ** exponent.`],
        solution: `def power(base, exponent):
    return base ** exponent
`,
        tests: [
          { name: "power(2, 10) == 1024", code: `assert power(2, 10) == 1024` },
          { name: "power(5, 0) == 1", code: `assert power(5, 0) == 1` },
        ],
      },
    ],
  },

  // ============================================================
  {
    id: "functions",
    title: "Procedures & Functions",
    color: "green",
    hex: "#059669",
    icon: "🧱",
    lesson: {
      concept: `
        <p>Python only has one keyword, <code>def</code>, for both procedures and functions.
           A <b>function</b> uses <code>return</code> to send a value back; a <b>procedure</b>
           is just a Python function that never returns anything useful (it implicitly
           returns <code>None</code>). IGCSE limits you to <b>at most two parameters</b>.</p>
        <p><b>Scope</b>: a variable created inside a function is <b>local</b> — it only exists
           while that function runs. A variable created outside any function is <b>global</b> —
           visible everywhere, but a function can't reassign it without a <code>global</code>
           declaration.</p>
        <p><b>Library routines</b> you'll use constantly: <code>%</code> (MOD), <code>//</code>
           (DIV), <code>round(value, places)</code>, and <code>random.random()</code> for a
           random float between 0 and 1.</p>
      `,
      example: `def stars(number):          # procedure-style: no return
    print("*" * number)

def celsius(temperature):   # function: returns a value
    return (temperature - 32) / 1.8

stars(5)                    # *****
mytemp = celsius(98)        # call as part of an expression
print(round(mytemp, 1))     # library routine: round to 1 decimal place

import random
print(random.random())      # library routine: random float, 0 to 1`,
      keyPoints: [
        "def name(params): ... return value — omit return (or use bare return) for a procedure",
        "IGCSE caps procedures/functions at 2 parameters",
        "A variable declared inside a function is local to it and disappears when the function ends",
        "round(), and random.random() (after import random) are the library routines you need",
      ],
    },
    mcqs: [
      {
        q: "What does a Python function return if it has no return statement?",
        options: ["0", `""`, "None", "An error"],
        correct: 2,
        explain: "A function without an explicit return implicitly returns the special value None.",
      },
      {
        q: "Which correctly calls a function celsius(temp) and stores the result?",
        options: [`c = celsius(98)`, `c = CALL celsius(98)`, `celsius c = 98`, `c <- celsius(98)`],
        correct: 0,
        explain: "In Python, a function call is just name(arguments) used like any other expression.",
      },
      {
        q: "A variable created inside a function, and never mentioned outside it, is called...",
        options: ["Global", "Local", "Constant", "Static"],
        correct: 1,
        explain: "Its scope — where it can be used — is restricted to that function; it's local.",
      },
    ],
    exercises: [
      {
        id: "func_fahrenheit",
        mode: "return",
        title: "Celsius to Fahrenheit",
        description: `
          <p>Write a function <code>fahrenheit(temp_c)</code> that converts a Celsius
             temperature to Fahrenheit and returns it.</p>
          <p>Formula: <code>F = (C &times; 9 / 5) + 32</code></p>
        `,
        starter: `def fahrenheit(temp_c):
    # your code here
    return None
`,
        inputs: null,
        hints: ["Multiply temp_c by 9, divide by 5, then add 32.", "Remember to return the result."],
        solution: `def fahrenheit(temp_c):
    return (temp_c * 9 / 5) + 32
`,
        tests: [
          { name: "fahrenheit(0) == 32", code: `assert abs(fahrenheit(0) - 32) < 0.001` },
          { name: "fahrenheit(100) == 212", code: `assert abs(fahrenheit(100) - 212) < 0.001` },
          { name: "fahrenheit(20) == 68", code: `assert abs(fahrenheit(20) - 68) < 0.001` },
        ],
      },
      {
        id: "func_stars",
        mode: "print",
        title: "Stars procedure",
        description: `
          <p>Write a procedure <code>print_stars(number)</code> that prints <code>number</code>
             asterisks on a single line (no spaces between them, no return value needed).</p>
        `,
        starter: `def print_stars(number):
    # your code here
    print()
`,
        inputs: null,
        hints: [
          `print("*" * number) repeats the string "*" that many times.`,
          "Alternatively, loop number times printing '*' with end=''.",
        ],
        solution: `def print_stars(number):
    print("*" * number)
`,
        tests: [
          {
            name: "print_stars(5) prints 5 stars",
            code: `import io, sys\n__cap = io.StringIO()\n__old = sys.stdout\nsys.stdout = __cap\nprint_stars(5)\nsys.stdout = __old\nassert "*****" in __cap.getvalue()`,
          },
          {
            name: "print_stars(3) prints 3 stars, not 5",
            code: `import io, sys\n__cap = io.StringIO()\n__old = sys.stdout\nsys.stdout = __cap\nprint_stars(3)\nsys.stdout = __old\n__out = __cap.getvalue()\nassert "***" in __out and "****" not in __out`,
          },
        ],
      },

      {
        id: "func_arearectangle",
        mode: "return",
        title: "Rectangle area",
        description: `
          <p>Write a function <code>area_rectangle(width, height)</code> that returns the area
             of a rectangle.</p>
        `,
        starter: `def area_rectangle(width, height):
    # your code here
    return None
`,
        inputs: null,
        hints: ["Area = width * height."],
        solution: `def area_rectangle(width, height):
    return width * height
`,
        tests: [
          { name: "area_rectangle(3, 4) == 12", code: `assert area_rectangle(3, 4) == 12` },
          { name: "area_rectangle(5, 5) == 25", code: `assert area_rectangle(5, 5) == 25` },
        ],
      },
      {
        id: "func_greet",
        mode: "print",
        title: "Greet procedure",
        description: `
          <p>Write a procedure <code>greet(name)</code> that prints <code>"Hello, NAME!"</code>
             — no return value needed, just print it.</p>
        `,
        starter: `def greet(name):
    # your code here
    print()
`,
        inputs: null,
        hints: [`print("Hello, " + name + "!") builds and prints the greeting.`],
        solution: `def greet(name):
    print("Hello, " + name + "!")
`,
        tests: [
          {
            name: "greet('Ana') prints Hello, Ana!",
            code: `import io, sys\n__cap = io.StringIO()\n__old = sys.stdout\nsys.stdout = __cap\ngreet("Ana")\nsys.stdout = __old\nassert "Hello, Ana!" in __cap.getvalue()`,
          },
        ],
      },
      {
        id: "func_maxtwo",
        mode: "return",
        title: "Max of two",
        description: `
          <p>Write a function <code>max_two(a, b)</code> that returns whichever of
             <code>a</code> and <code>b</code> is larger, without using the built-in
             <code>max()</code>.</p>
        `,
        starter: `def max_two(a, b):
    # your code here
    return None
`,
        inputs: null,
        hints: ["Use an if / else comparing a and b."],
        solution: `def max_two(a, b):
    if a > b:
        return a
    else:
        return b
`,
        tests: [
          { name: "max_two(3, 9) == 9", code: `assert max_two(3, 9) == 9` },
          { name: "max_two(10, 2) == 10", code: `assert max_two(10, 2) == 10` },
        ],
      },
    ],
  },

  // ============================================================
  {
    id: "arrays",
    title: "Arrays (Python Lists)",
    color: "purple",
    hex: "#9333ea",
    icon: "🗃️",
    lesson: {
      concept: `
        <p>Python doesn't have a separate array type for IGCSE-level work — you use a
           <b>list</b> instead. Like an array, a list holds several items under one name,
           each reachable by its <b>index</b>, always starting at <b>0</b>.</p>
        <p>A <b>2D array</b> (a table of rows and columns) is written as a <b>list of
           lists</b> — one inner list per row.</p>
      `,
      example: `my_list = [27, 19, 36, 42, 16, 89, 21, 16, 55, 72]
print(my_list[0])     # 27 -- first element
print(my_list[9])     # 72 -- last element

my_table = [[27, 31, 17], [19, 67, 48], [36, 98, 29]]
print(my_table[1][2]) # 48 -- row 1, column 2

for row in my_table:
    for value in row:
        print(value, end=" ")`,
      keyPoints: [
        "Lists are indexed from 0, just like Python strings",
        "A 2D array becomes a list of lists: table[row][column]",
        "Unlike a true array, a Python list CAN mix types — but for IGCSE keep one type per list",
      ],
    },
    mcqs: [
      {
        q: "What is the index of the first element in a Python list?",
        options: ["-1", "0", "1", "It depends on the list"],
        correct: 1,
        explain: "Python lists (like strings) are always indexed from 0.",
      },
      {
        q: "Given table = [[1,2],[3,4],[5,6]], which expression gets the value 4?",
        options: ["table[1][1]", "table[2][0]", "table[1,1]", "table[4]"],
        correct: 0,
        explain: "Row index 1 is [3, 4]; column index 1 of that row is 4.",
      },
      {
        q: "Which expression creates a list of ten zeros?",
        options: ["[0] * 10", "range(10)", "list(10)", "[0, 10]"],
        correct: 0,
        explain: "Multiplying a one-item list by 10 repeats that item ten times.",
      },
    ],
    exercises: [
      {
        id: "arr_sumlist",
        mode: "return",
        title: "Sum a list",
        description: `
          <p>Write a function <code>sum_list(values)</code> that returns the total of all the
             numbers in the list <code>values</code>, using a loop (not the built-in
             <code>sum()</code>).</p>
        `,
        starter: `def sum_list(values):
    total = 0
    # your loop here
    return total
`,
        inputs: null,
        hints: ["Loop with for value in values:", "Add each value to total as you go."],
        solution: `def sum_list(values):
    total = 0
    for value in values:
        total += value
    return total
`,
        tests: [
          { name: "sum_list([27, 19, 36]) == 82", code: `assert sum_list([27, 19, 36]) == 82` },
          { name: "sum_list([]) == 0", code: `assert sum_list([]) == 0` },
          { name: "sum_list([5]) == 5", code: `assert sum_list([5]) == 5` },
        ],
      },
      {
        id: "arr_maxtable",
        mode: "return",
        title: "Find the max in a 2D table",
        description: `
          <p>Write a function <code>max_in_table(table)</code> that returns the largest value
             anywhere in a 2D list (list of rows), using a nested loop.</p>
        `,
        starter: `def max_in_table(table):
    # your nested loop here
    return None
`,
        inputs: null,
        hints: [
          "Start by assuming the largest value found so far is table[0][0].",
          "Outer loop over each row, inner loop over each value in that row, updating your 'largest so far' when you find something bigger.",
        ],
        solution: `def max_in_table(table):
    largest = table[0][0]
    for row in table:
        for value in row:
            if value > largest:
                largest = value
    return largest
`,
        tests: [
          {
            name: "max_in_table finds 98 in the textbook's example table",
            code: `t = [[27, 31, 17], [19, 67, 48], [36, 98, 29], [42, 22, 95]]\nassert max_in_table(t) == 98`,
          },
          { name: "max_in_table works on a single row", code: `assert max_in_table([[3, 9, 1]]) == 9` },
        ],
      },

      {
        id: "arr_average",
        mode: "return",
        title: "Average of a list",
        description: `
          <p>Write a function <code>average_list(values)</code> that returns the average of the
             numbers in the list <code>values</code>, using a loop.</p>
        `,
        starter: `def average_list(values):
    total = 0
    # your loop here
    return total / len(values)
`,
        inputs: null,
        hints: ["Loop with for value in values: total += value", "Then divide by len(values)."],
        solution: `def average_list(values):
    total = 0
    for value in values:
        total += value
    return total / len(values)
`,
        tests: [
          { name: "average_list([2, 4, 6]) == 4.0", code: `assert average_list([2, 4, 6]) == 4.0` },
          { name: "average_list([10]) == 10.0", code: `assert average_list([10]) == 10.0` },
        ],
      },
      {
        id: "arr_printtable",
        mode: "print",
        title: "Print a 2D table",
        description: `
          <p>Write a function <code>print_table(table)</code> that prints each row of a 2D
             list (list of lists) on its own line, with values separated by a single space.</p>
        `,
        starter: `def print_table(table):
    # your nested loop here
    print()
`,
        inputs: null,
        hints: [
          "Outer loop: for row in table:",
          `Inner: build a string of the row's values separated by spaces (e.g. " ".join(str(v) for v in row)), then print it.`,
        ],
        solution: `def print_table(table):
    for row in table:
        print(" ".join(str(v) for v in row))
`,
        tests: [
          {
            name: "print_table prints each row correctly",
            code: `import io, sys\n__cap = io.StringIO()\n__old = sys.stdout\nsys.stdout = __cap\nprint_table([[1, 2, 3], [4, 5, 6]])\nsys.stdout = __old\n__lines = [l for l in __cap.getvalue().split("\\n") if l]\nassert __lines == ["1 2 3", "4 5 6"]`,
          },
        ],
      },
      {
        id: "arr_countoccurrences",
        mode: "return",
        title: "Count occurrences",
        description: `
          <p>Write a function <code>count_occurrences(values, target)</code> that returns how
             many times <code>target</code> appears in the list <code>values</code>, using a
             loop (not the built-in <code>.count()</code>).</p>
        `,
        starter: `def count_occurrences(values, target):
    count = 0
    # your loop here
    return count
`,
        inputs: null,
        hints: ["Loop with for value in values:", "If value == target, add 1 to count."],
        solution: `def count_occurrences(values, target):
    count = 0
    for value in values:
        if value == target:
            count += 1
    return count
`,
        tests: [
          { name: "count_occurrences([1, 2, 2, 3, 2], 2) == 3", code: `assert count_occurrences([1, 2, 2, 3, 2], 2) == 3` },
          { name: "count_occurrences([1, 2, 3], 9) == 0", code: `assert count_occurrences([1, 2, 3], 9) == 0` },
        ],
      },
    ],
  },

  // ============================================================
  {
    id: "files",
    title: "File Handling",
    color: "red",
    hex: "#ea580c",
    icon: "📁",
    lesson: {
      concept: `
        <p>Data stored in RAM disappears when the program ends — saving it to a <b>file</b>
           makes it permanent. Python's <code>open()</code> function is used to both read and
           write files. This practice site runs Python fully in your browser, so file exercises
           use an in-memory "virtual" filesystem — the same <code>open()</code>/<code>read()</code>/
           <code>write()</code> code you'd use on a real computer.</p>
      `,
      example: `# writing
my_file = open("mytext.txt", "w")   # "w" = write (overwrites the file)
my_file.write("Hello, file!")
my_file.close()

# reading it back
my_file = open("mytext.txt", "r")   # "r" = read
contents = my_file.read()
my_file.close()
print(contents)                      # Hello, file!

# "with" closes the file for you automatically
with open("mytext.txt", "r") as f:
    print(f.read())`,
      keyPoints: [
        `"w" mode overwrites the whole file; "a" mode appends to the end; "r" mode reads`,
        "Always .close() a file once you're done with it (or use a with block, which closes it for you)",
        ".read() returns the WHOLE file as one string; .write(text) does not add a newline for you",
      ],
    },
    mcqs: [
      {
        q: "Which mode opens a file for writing, overwriting any existing content?",
        options: [`"r"`, `"w"`, `"a"`, `"x"`],
        correct: 1,
        explain: `"w" (write) mode replaces the file's contents; "a" (append) would add on to the end instead.`,
      },
      {
        q: "Which method should you call once you're finished with an open file?",
        options: [".end()", ".stop()", ".close()", ".exit()"],
        correct: 2,
        explain: ".close() releases the file so other code (or programs) can safely use it.",
      },
      {
        q: "What does f.read() return?",
        options: [
          "Just the first line of the file",
          "The whole file's contents as one string",
          "A list of the file's lines",
          "The file's name",
        ],
        correct: 1,
        explain: "read() with no arguments reads everything left in the file into a single string.",
      },
    ],
    exercises: [
      {
        id: "file_writeread",
        mode: "return",
        title: "Write and read back",
        description: `
          <p>Write a function <code>write_and_read(text)</code> that writes <code>text</code> to
             a file called <code>"myfile.txt"</code>, closes it, then reopens the file, reads its
             full contents back, closes it again, and returns what it read.</p>
        `,
        starter: `def write_and_read(text):
    # write text to "myfile.txt", then read it back and return it
    pass
`,
        inputs: null,
        hints: [
          `Open with open("myfile.txt", "w"), call .write(text), then .close().`,
          `Open again with open("myfile.txt", "r"), call .read(), close it, and return that value.`,
        ],
        solution: `def write_and_read(text):
    f = open("myfile.txt", "w")
    f.write(text)
    f.close()

    f = open("myfile.txt", "r")
    contents = f.read()
    f.close()
    return contents
`,
        tests: [
          { name: "write_and_read('Hello!') round-trips correctly", code: `assert write_and_read("Hello!") == "Hello!"` },
          { name: "write_and_read overwrites previous content", code: `write_and_read("first")\nassert write_and_read("second") == "second"` },
        ],
      },
      {
        id: "file_log",
        mode: "none",
        title: "Append log entries",
        description: `
          <p>Write a function <code>log_message(msg)</code> that <b>appends</b>
             <code>msg + "\\n"</code> to a file called <code>"log.txt"</code> (so repeated calls
             build up multiple lines rather than overwriting).</p>
        `,
        starter: `def log_message(msg):
    # append msg + "\\n" to "log.txt"
    pass
`,
        inputs: null,
        hints: [
          `Open the file in append mode: open("log.txt", "a")`,
          `Write msg + "\\n", then close the file.`,
        ],
        solution: `def log_message(msg):
    f = open("log.txt", "a")
    f.write(msg + "\\n")
    f.close()
`,
        tests: [
          {
            name: "two calls append two separate lines",
            code: `import os\nif os.path.exists("log.txt"):\n    os.remove("log.txt")\nlog_message("hello")\nlog_message("world")\nwith open("log.txt") as f:\n    content = f.read()\nassert content == "hello\\nworld\\n"`,
          },
        ],
      },

      {
        id: "file_countlines",
        mode: "return",
        title: "Count lines in a file",
        description: `
          <p>Write a function <code>count_lines(filename)</code> that opens the given file,
             reads it, and returns how many lines it contains.</p>
        `,
        starter: `def count_lines(filename):
    # open the file, read it, and return the number of lines
    pass
`,
        inputs: null,
        hints: [
          `Open with open(filename, "r"), then .read() the whole file.`,
          `.splitlines() splits the text into a list of lines — len() of that list is your answer.`,
        ],
        solution: `def count_lines(filename):
    f = open(filename, "r")
    contents = f.read()
    f.close()
    return len(contents.splitlines())
`,
        tests: [
          {
            name: "count_lines counts 3 lines correctly",
            code: `f = open("lines.txt", "w")\nf.write("a\\nb\\nc\\n")\nf.close()\nassert count_lines("lines.txt") == 3`,
          },
        ],
      },
      {
        id: "file_writelist",
        mode: "none",
        title: "Save a list to a file",
        description: `
          <p>Write a procedure <code>save_list(filename, items)</code> that writes each item in
             the list <code>items</code> to <code>filename</code>, one per line. This exercise
             doesn't need <code>return</code> or <code>print</code> — it just needs to write the
             file correctly.</p>
        `,
        starter: `def save_list(filename, items):
    # write each item on its own line
    pass
`,
        inputs: null,
        hints: [
          `Open with open(filename, "w").`,
          `Loop over items, writing item + "\\n" for each one, then close the file.`,
        ],
        solution: `def save_list(filename, items):
    f = open(filename, "w")
    for item in items:
        f.write(item + "\\n")
    f.close()
`,
        tests: [
          {
            name: "save_list writes each item on its own line",
            code: `save_list("saved.txt", ["apple", "banana", "cherry"])\nwith open("saved.txt") as f:\n    content = f.read()\nassert content == "apple\\nbanana\\ncherry\\n"`,
          },
        ],
      },
      {
        id: "file_readprint",
        mode: "print",
        title: "Print a file's contents",
        description: `
          <p>Write a procedure <code>print_file_contents(filename)</code> that opens the given
             file and prints everything in it.</p>
        `,
        starter: `def print_file_contents(filename):
    # open the file and print its contents
    print()
`,
        inputs: null,
        hints: [`Open, .read() the contents into a variable, close the file, then print() that variable.`],
        solution: `def print_file_contents(filename):
    f = open(filename, "r")
    contents = f.read()
    f.close()
    print(contents)
`,
        tests: [
          {
            name: "print_file_contents prints the file's text",
            code: `f = open("note.txt", "w")\nf.write("Hello from a file!")\nf.close()\nimport io, sys\n__cap = io.StringIO()\n__old = sys.stdout\nsys.stdout = __cap\nprint_file_contents("note.txt")\nsys.stdout = __old\nassert "Hello from a file!" in __cap.getvalue()`,
          },
        ],
      },
    ],
  },
  {
    id: "customfunctions",
    title: "Create Your Own Function",
    color: "indigo",
    hex: "#4f46e5",
    icon: "🛠️",
    lesson: {
      concept: `
        <p>You've used functions written to a fixed spec — now it's your turn to <b>design</b> one.
           Designing a function means deciding: what should it be called? What parameters does it
           need? Should it <code>return</code> a value or just <code>print</code> something? And
           what's the simplest, most reliable algorithm to get from input to output?</p>
        <p>A good habit: before typing any code, write the task as a one-line comment, list the
           inputs (parameters) and the output (return value), then build the body up one step at a
           time — testing as you go, just like you will here.</p>
        <p>These exercises give you a task, not a solution. You choose the loop, the condition, the
           accumulator variable names — as long as the function behaves correctly for the tests.</p>
      `,
      example: `def is_leap_year(year):
    # design decision: one parameter in, one boolean out
    if year % 400 == 0:
        return True
    if year % 100 == 0:
        return False
    return year % 4 == 0

# decompose a bigger job into a function you designed yourself
def count_leap_years(start, end):
    total = 0
    for y in range(start, end + 1):
        if is_leap_year(y):
            total += 1
    return total

print(is_leap_year(2024))          # True
print(count_leap_years(2000, 2024))`,
      keyPoints: [
        "Decide parameters and return type before writing the body",
        "Reuse a function you've already written inside a new one (decomposition)",
        "Pick one sensible algorithm — there's rarely only one correct way to write it",
        "Test small pieces as you build, don't write the whole function blind",
      ],
    },
    mcqs: [
      {
        q: "Before writing a new function, which two things should you decide first?",
        options: [
          "The variable names used inside loops only",
          "What parameters it needs and what it should return",
          "How long the function's name should be",
          "Whether to use tabs or spaces",
        ],
        correct: 1,
        explain: "Good design starts from the interface: what goes in (parameters) and what comes out (return value).",
      },
      {
        q: "Calling one function you wrote from inside another function you wrote is an example of...",
        options: ["Recursion", "Decomposition", "Iteration", "Casting"],
        correct: 1,
        explain: "Breaking a problem into smaller functions and combining them is decomposition.",
      },
      {
        q: "A function you designed keeps failing one test case. What's the best next step?",
        options: [
          "Delete the test case",
          "Rewrite the whole function from scratch immediately",
          "Trace through the failing case by hand, step by step, comparing to your code's logic",
          "Ignore it and submit anyway",
        ],
        correct: 2,
        explain: "Tracing the specific failing case by hand is the fastest way to spot where your logic diverges from what's needed.",
      },
    ],
    exercises: [
      {
        id: "custom_is_even",
        mode: "return",
        title: "Design: is_even",
        description: `
          <p>Design a function <code>is_even(number)</code> that returns <code>True</code> if
             <code>number</code> is even and <code>False</code> otherwise. Decide the logic
             yourself — there's more than one way to check.</p>
        `,
        starter: `def is_even(number):
    # your design here
    return None
`,
        inputs: null,
        hints: [
          `A number is even if it has no remainder when divided by 2 — which operator gives you a remainder?`,
          `return number % 2 == 0 is one valid design, but any equivalent logic is fine.`,
        ],
        solution: `def is_even(number):
    return number % 2 == 0
`,
        tests: [
          { name: "is_even(4) is True", code: "assert is_even(4) == True" },
          { name: "is_even(7) is False", code: "assert is_even(7) == False" },
          { name: "is_even(0) is True", code: "assert is_even(0) == True" },
        ],
      },
      {
        id: "custom_max_of_three",
        mode: "return",
        title: "Design: largest of three",
        description: `
          <p>Design a function <code>largest(a, b, c)</code> that returns the largest of the three
             numbers. Do not use Python's built-in <code>max()</code> — work it out with your own
             comparisons.</p>
        `,
        starter: `def largest(a, b, c):
    # your design here — no max()
    return None
`,
        inputs: null,
        hints: [
          `Start by assuming a is the largest, then compare it against b and c, updating your "best so far" variable when you find something bigger.`,
        ],
        solution: `def largest(a, b, c):
    best = a
    if b > best:
        best = b
    if c > best:
        best = c
    return best
`,
        tests: [
          { name: "largest(1, 5, 3) == 5", code: "assert largest(1, 5, 3) == 5" },
          { name: "largest(9, 2, 4) == 9", code: "assert largest(9, 2, 4) == 9" },
          { name: "largest(1, 2, 8) == 8", code: "assert largest(1, 2, 8) == 8" },
          { name: "largest(5, 5, 5) == 5", code: "assert largest(5, 5, 5) == 5" },
        ],
      },
      {
        id: "custom_count_vowels",
        mode: "return",
        title: "Design: count_vowels",
        description: `
          <p>Design a function <code>count_vowels(text)</code> that returns how many vowels
             (a, e, i, o, u — either case) appear in <code>text</code>. Combine a loop with a
             string check — your choice of approach.</p>
        `,
        starter: `def count_vowels(text):
    # your design here
    return None
`,
        inputs: null,
        hints: [
          `Loop through each character with a for loop, and check if it's in "aeiouAEIOU" using the in operator.`,
          `Keep a running total variable that starts at 0 and increases by 1 each time you find a vowel.`,
        ],
        solution: `def count_vowels(text):
    total = 0
    for ch in text:
        if ch.lower() in "aeiou":
            total += 1
    return total
`,
        tests: [
          { name: 'count_vowels("Hello") == 2', code: 'assert count_vowels("Hello") == 2' },
          { name: 'count_vowels("PYTHON") == 1', code: 'assert count_vowels("PYTHON") == 1' },
          { name: 'count_vowels("xyz") == 0', code: 'assert count_vowels("xyz") == 0' },
        ],
      },
      {
        id: "custom_classify_triangle",
        mode: "return",
        title: "Design: classify_triangle",
        description: `
          <p>Design a function <code>classify_triangle(a, b, c)</code> that returns
             <code>"Equilateral"</code> if all three sides are equal, <code>"Isosceles"</code> if
             exactly two are equal, or <code>"Scalene"</code> if none are equal. Decide the order
             of your conditions yourself.</p>
        `,
        starter: `def classify_triangle(a, b, c):
    # your design here
    return None
`,
        inputs: null,
        hints: [
          `Check the "all equal" case first — if that's true you're done.`,
          `For "exactly two equal", you need to check all three possible pairs: a==b, b==c, a==c.`,
        ],
        solution: `def classify_triangle(a, b, c):
    if a == b == c:
        return "Equilateral"
    if a == b or b == c or a == c:
        return "Isosceles"
    return "Scalene"
`,
        tests: [
          { name: "classify_triangle(3,3,3) == Equilateral", code: 'assert classify_triangle(3, 3, 3) == "Equilateral"' },
          { name: "classify_triangle(3,3,5) == Isosceles", code: 'assert classify_triangle(3, 3, 5) == "Isosceles"' },
          { name: "classify_triangle(4,5,6) == Scalene", code: 'assert classify_triangle(4, 5, 6) == "Scalene"' },
        ],
      },
      {
        id: "custom_sum_of_multiples",
        mode: "return",
        title: "Design: sum_of_multiples",
        description: `
          <p>Design a function <code>sum_of_multiples(limit)</code> that returns the sum of all
             the multiples of 3 or 5 below <code>limit</code>. For example, below 10 the multiples
             of 3 or 5 are 3, 5, 6, 9, which sum to 23. Choose your own loop and accumulator.</p>
        `,
        starter: `def sum_of_multiples(limit):
    # your design here
    return None
`,
        inputs: null,
        hints: [
          `range(limit) gives you every whole number below limit.`,
          `A number is a multiple of 3 or 5 if number % 3 == 0 or number % 5 == 0 — add it to a running total when true.`,
        ],
        solution: `def sum_of_multiples(limit):
    total = 0
    for number in range(limit):
        if number % 3 == 0 or number % 5 == 0:
            total += number
    return total
`,
        tests: [
          { name: "sum_of_multiples(10) == 23", code: "assert sum_of_multiples(10) == 23" },
          { name: "sum_of_multiples(1) == 0", code: "assert sum_of_multiples(1) == 0" },
          { name: "sum_of_multiples(20) == 78", code: "assert sum_of_multiples(20) == 78" },
        ],
      },
    ],
  },
  {
    id: "oop",
    title: "Object-Oriented Programming",
    color: "rose",
    hex: "#be123c",
    icon: "🏛️",
    lesson: {
      concept: `
        <p>A <b>class</b> is a blueprint for creating <b>objects</b> that bundle together data
           (<b>attributes</b>) and behaviour (<b>methods</b>). Define one with <code>class</code>,
           give it a special <code>__init__</code> method (the <b>constructor</b>) that runs
           automatically when a new object is created, and store data on the object using
           <code>self.attribute = value</code>.</p>
        <p><b>self</b> always refers to "this particular object" — it's the first parameter of
           every method, and Python passes it in automatically when you call
           <code>object.method()</code>. You never pass it yourself.</p>
        <p>Creating an object from a class is called <b>instantiation</b>: <code>ClassName(args)</code>
           calls <code>__init__</code> and hands you back a new object with its own independent
           copy of every attribute.</p>
      `,
      example: `class Dog:
    def __init__(self, name, age):
        self.name = name        # attribute
        self.age = age          # attribute

    def bark(self):              # method
        return f"{self.name} says Woof!"

    def is_adult(self):
        return self.age >= 2

rex = Dog("Rex", 3)              # instantiation — calls __init__
print(rex.bark())                # Rex says Woof!
print(rex.is_adult())            # True
print(rex.name)                  # access an attribute directly: Rex`,
      keyPoints: [
        "class Name: ... defines a blueprint; Name(args) creates ('instantiates') an object from it",
        "__init__(self, ...) is the constructor — it runs automatically on creation",
        "self refers to the specific object a method was called on; Python supplies it for you",
        "self.attribute = value stores data on the object; object.method() calls its behaviour",
      ],
    },
    mcqs: [
      {
        q: "Which special method runs automatically when a new object is created?",
        options: ["__main__", "__init__", "__self__", "__new__"],
        correct: 1,
        explain: "__init__ is the constructor — Python calls it automatically whenever you write ClassName(...).",
      },
      {
        q: "Inside a class's method, what does self refer to?",
        options: [
          "The class itself, not any particular object",
          "The specific object the method was called on",
          "A global variable shared by all objects",
          "Nothing — it's optional and can be removed",
        ],
        correct: 1,
        explain: "self is the object the method is being called on — it's how a method reaches that object's own attributes.",
      },
      {
        q: "Given class Circle: def __init__(self, radius): self.radius = radius, how do you create a Circle with radius 5?",
        options: ["Circle.new(5)", "c = Circle(5)", "c = new Circle(5)", "c = Circle.radius(5)"],
        correct: 1,
        explain: "Calling the class name as a function — Circle(5) — instantiates it and passes 5 into __init__.",
      },
    ],
    exercises: [
      {
        id: "oop_rectangle",
        mode: "return",
        title: "Rectangle class",
        description: `
          <p>Write a class <code>Rectangle</code> whose <code>__init__(self, width, height)</code>
             stores both as attributes, and which has a method <code>area(self)</code> that
             returns <code>width * height</code>.</p>
        `,
        starter: `class Rectangle:
    def __init__(self, width, height):
        # your code here
        pass

    def area(self):
        # your code here
        return None
`,
        inputs: null,
        hints: [
          `In __init__, store both parameters with self.width = width and self.height = height.`,
          `In area, return self.width * self.height.`,
        ],
        solution: `class Rectangle:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height
`,
        tests: [
          { name: "Rectangle(3, 4).area() == 12", code: "r = Rectangle(3, 4)\nassert r.area() == 12" },
          { name: "Rectangle(5, 5).area() == 25", code: "r = Rectangle(5, 5)\nassert r.area() == 25" },
          { name: "attributes stored correctly", code: "r = Rectangle(7, 2)\nassert r.width == 7 and r.height == 2" },
        ],
      },
      {
        id: "oop_dog_bark",
        mode: "return",
        title: "Dog class",
        description: `
          <p>Write a class <code>Dog</code> whose <code>__init__(self, name)</code> stores
             <code>name</code>, and which has a method <code>bark(self)</code> that returns the
             string <code>"{name} says Woof!"</code>.</p>
        `,
        starter: `class Dog:
    def __init__(self, name):
        # your code here
        pass

    def bark(self):
        # your code here
        return None
`,
        inputs: null,
        hints: [`Use an f-string: f"{self.name} says Woof!"`],
        solution: `class Dog:
    def __init__(self, name):
        self.name = name

    def bark(self):
        return f"{self.name} says Woof!"
`,
        tests: [
          { name: 'Dog("Rex").bark() == "Rex says Woof!"', code: 'd = Dog("Rex")\nassert d.bark() == "Rex says Woof!"' },
          { name: 'Dog("Bella").bark() == "Bella says Woof!"', code: 'd = Dog("Bella")\nassert d.bark() == "Bella says Woof!"' },
        ],
      },
      {
        id: "oop_bankaccount",
        mode: "return",
        title: "BankAccount class",
        description: `
          <p>Write a class <code>BankAccount</code> whose <code>__init__(self, balance=0)</code>
             stores a starting balance (default 0), and which has a method
             <code>deposit(self, amount)</code> that adds <code>amount</code> to the balance and
             returns the new balance.</p>
        `,
        starter: `class BankAccount:
    def __init__(self, balance=0):
        # your code here
        pass

    def deposit(self, amount):
        # your code here — update self.balance and return it
        return None
`,
        inputs: null,
        hints: [
          `In __init__, store self.balance = balance.`,
          `In deposit, do self.balance += amount, then return self.balance.`,
        ],
        solution: `class BankAccount:
    def __init__(self, balance=0):
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount
        return self.balance
`,
        tests: [
          { name: "default balance starts at 0", code: "a = BankAccount()\nassert a.balance == 0" },
          { name: "deposit(50) returns 50", code: "a = BankAccount()\nassert a.deposit(50) == 50" },
          { name: "two deposits accumulate", code: "a = BankAccount(10)\na.deposit(5)\nassert a.deposit(5) == 20" },
        ],
      },
      {
        id: "oop_circle",
        mode: "return",
        title: "Circle class",
        description: `
          <p>Write a class <code>Circle</code> whose <code>__init__(self, radius)</code> stores
             <code>radius</code>, with a method <code>area(self)</code> returning
             <code>3.14159 * radius ** 2</code> and a method <code>circumference(self)</code>
             returning <code>2 * 3.14159 * radius</code>.</p>
        `,
        starter: `class Circle:
    def __init__(self, radius):
        # your code here
        pass

    def area(self):
        # your code here
        return None

    def circumference(self):
        # your code here
        return None
`,
        inputs: null,
        hints: [`Use the constant 3.14159 for pi in both methods, and self.radius for the stored value.`],
        solution: `class Circle:
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return 3.14159 * self.radius ** 2

    def circumference(self):
        return 2 * 3.14159 * self.radius
`,
        tests: [
          { name: "Circle(2).area() ~ 12.566", code: "c = Circle(2)\nassert abs(c.area() - 12.56636) < 0.01" },
          { name: "Circle(1).circumference() ~ 6.283", code: "c = Circle(1)\nassert abs(c.circumference() - 6.28318) < 0.01" },
        ],
      },
      {
        id: "oop_student_grade",
        mode: "return",
        title: "Student class",
        description: `
          <p>Write a class <code>Student</code> whose <code>__init__(self, name, score)</code>
             stores both, with a method <code>get_grade(self)</code> that returns
             <code>"A"</code> if <code>score &gt;= 70</code>, <code>"B"</code> if
             <code>score &gt;= 50</code>, otherwise <code>"C"</code>.</p>
        `,
        starter: `class Student:
    def __init__(self, name, score):
        # your code here
        pass

    def get_grade(self):
        # your code here
        return None
`,
        inputs: null,
        hints: [`Check the highest threshold first: if self.score >= 70, then elif self.score >= 50, else "C".`],
        solution: `class Student:
    def __init__(self, name, score):
        self.name = name
        self.score = score

    def get_grade(self):
        if self.score >= 70:
            return "A"
        elif self.score >= 50:
            return "B"
        else:
            return "C"
`,
        tests: [
          { name: "score 80 -> A", code: 's = Student("Ann", 80)\nassert s.get_grade() == "A"' },
          { name: "score 55 -> B", code: 's = Student("Ben", 55)\nassert s.get_grade() == "B"' },
          { name: "score 30 -> C", code: 's = Student("Cy", 30)\nassert s.get_grade() == "C"' },
          { name: "boundary 70 -> A", code: 's = Student("Di", 70)\nassert s.get_grade() == "A"' },
        ],
      },
    ],
  },
];
