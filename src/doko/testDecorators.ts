function setValue(value) {
    return (target, _context) => {
        target[_context.name] = value
    }
}

const obj = {
    @setValue(1)
    age,
}

console.log(obj.age) //1