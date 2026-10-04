// Part B: Questions 1–5


// 1. Deep Equal
function deepEqual(objA, objB) {
    if (objA === objB) {
        return true;
    }

    // Stop here if either value is null or isn't an object.
    if (objA === null || objB === null ||
        typeof objA !== "object" || typeof objB !== "object") {
        return false;
    }

    const keysA = Object.keys(objA);
    const keysB = Object.keys(objB);

    if (keysA.length !== keysB.length) {
        return false;
    }

    for (const key of keysA) {
        // Check that the key exists, then compare what's inside it too.
        if (!Object.hasOwn(objB, key) || !deepEqual(objA[key], objB[key])) {
            return false;
        }
    }

    return true;
}

// Test cases for deepEqual
console.log("Question 1: Deep Equal");
console.log(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })); // true
console.log(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 3 } })); // false
console.log(deepEqual({ a: 1 }, { a: 1, b: 2 })); // false


// 2. Object Diff
function diffObjects(oldObj, newObj) {
    const result = { added: {}, removed: {}, changed: {} };

    for (const key of Object.keys(oldObj)) {
        if (!Object.hasOwn(newObj, key)) {
            result.removed[key] = oldObj[key];
        } else if (oldObj[key] !== newObj[key]) {
            // Keep both the old and new values so we can see the change.
            result.changed[key] = { from: oldObj[key], to: newObj[key] };
        }
    }

    for (const key of Object.keys(newObj)) {
        if (!Object.hasOwn(oldObj, key)) {
            result.added[key] = newObj[key];
        }
    }

    return result;
}

// Test cases for diffObjects
console.log("Question 2: Object Diff");
console.log(diffObjects(
    { name: "Julia", role: "Engineer", country: "Nigeria" },
    { name: "Julia", role: "Senior Engineer", city: "Kingston" }
));
// added: { city: "Kingston" }
// removed: { country: "Nigeria" }
// changed: { role: { from: "Engineer", to: "Senior Engineer" } }

// 3. Deep Freeze
function deepFreeze(obj) {
    if (obj === null || typeof obj !== "object") {
        return obj;
    }

    // Freeze the objects inside this one too.
    for (const value of Object.values(obj)) {
        deepFreeze(value);
    }

    return Object.freeze(obj);
}

console.log("Question 3: Deep Freeze");
const config = deepFreeze({
    api: { baseUrl: "https://x.com", retries: 3 },
    debug: false
});

// Testing the frozen object
// These changes won't work because the object is frozen.
config.api.baseUrl = "https://changed.com";
config.debug = true;
console.log(config.api.baseUrl, config.debug); // "https://x.com" false
console.log(Object.isFrozen(config.api)); // true

// 4. Private Counter Factory
function createCounter() {

    // Keeping count here means it can't be accessed as counter.count.
    let count = 0;

    return {
        increment() {
            count++;
        },
        decrement() {
            count--;
        },
        // This lets us read counter.value without calling a function.
        get value() {
            return count;
        }
    };
}

// Test cases for createCounter
console.log("Question 4: Private Counter Factory");
const counter = createCounter();
counter.increment();
counter.increment();
counter.decrement();
console.log(counter.value); // 1
console.log(counter.count); // undefined (count is private)


// 5. Schema Validator
function validateSchema(obj, schema) {
    const errors = [];

    // Check each required key and the type its value should have.
    for (const key of Object.keys(schema)) {
        if (!Object.hasOwn(obj, key)) {
            errors.push(key + ": missing property");
        } else if (typeof obj[key] !== schema[key]) {
            errors.push(key + ": expected " + schema[key] + ", got " + typeof obj[key]);
        }
    }

    return errors;
}

// Test cases for validateSchema
console.log("Question 5: Schema Validator");
const schema = { name: "string", age: "number", isAdmin: "boolean" };
console.log(validateSchema({ name: "Ada", age: 21, isAdmin: false }, schema));
// []
console.log(validateSchema({ name: "Ada", age: "21" }, schema));
// ["age: expected number, got string", "isAdmin: missing property"]
