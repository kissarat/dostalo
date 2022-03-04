
const Digits = '0123456789'
const ASCIILowerCase = 'abcdefghijklmnopqrstuvwxyz'
const ASCIIUpperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const ASCIIAlphabet = ASCIILowerCase + ASCIIUpperCase
const Punctuation = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'
const Whitespace = ' \t\n\r\x0b\x0c'
const Printable = Digits + ASCIIAlphabet + Punctuation

module.exports = { Digits, ASCIILowerCase, ASCIIUpperCase, ASCIIAlphabet, Punctuation, Whitespace, Printable }
