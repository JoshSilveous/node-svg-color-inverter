import * as fs from 'fs'
import * as cheerio from 'cheerio'
import process from 'process'

// Function to invert a hex color
const invertHexColor = (hex: string): string => {
	if (hex.startsWith('#')) {
		hex = hex.slice(1)
	}
	if (hex.length !== 6) {
		throw new Error('Invalid hex color')
	}
	const r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16).padStart(2, '0')
	const g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16).padStart(2, '0')
	const b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16).padStart(2, '0')
	return `#${r}${g}${b}`
}

// Function to process the SVG file
const invertSvgColors = (inputFile: string, outputFile: string): void => {
	const svgContent = fs.readFileSync(inputFile, 'utf8')
	const $ = cheerio.load(svgContent, { xmlMode: true })

	$('*').each((_, element) => {
		const $element = $(element)
		const attributes = $element.attr()
		for (const attr in attributes) {
			if (attributes.hasOwnProperty(attr)) {
				const value = attributes[attr]
				if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
					attributes[attr] = invertHexColor(value)
				}
			}
		}
	})

	fs.writeFileSync(outputFile, $.xml())
	console.log(`Inverted SVG colors and saved to ${outputFile}`)
}

// Get input and output file names from command line arguments
const args = process.argv.slice(2)
if (args.length !== 2) {
	console.error('Usage: ts-node script.ts <input-file> <output-file>')
	process.exit(1)
}

const [inputFile, outputFile] = args
invertSvgColors(inputFile, outputFile)
