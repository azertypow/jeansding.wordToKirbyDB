import {readFile} from 'fs/promises'
import {parse, HTMLElement} from 'node-html-parser'
import {ObjectItem} from "./ObjectItem"
import {marked} from "marked"

async function main() {

  const contentMDFile =
    await readFile(
      './outputHTML/output.html',
      {
        encoding: 'utf8',
      },
    )

  const parsed = parse(contentMDFile, {})

  const arrayOfObjectItem: ObjectItem[] = []
  let tempObjectItem = new ObjectItem()

  const htmlElements: HTMLElement[] = parsed.childNodes
    .filter(value => {
      return value instanceof HTMLElement
    }) as HTMLElement[]

  const classifiedHtmlElement: {tagName: string, textContent: string}[][] = []
  let tempArrayToClassifyHTMLMElement: {tagName: string, textContent: string}[] = []

  for(const htmlElement of htmlElements) {
    if(htmlElement.textContent === 'Jeansdinge') {
      classifiedHtmlElement.push(tempArrayToClassifyHTMLMElement)
      tempArrayToClassifyHTMLMElement = []
    } else {

      const img = htmlElement.querySelector('img')

      if( img instanceof HTMLElement ) {
        tempArrayToClassifyHTMLMElement.push({
          textContent: img.attributes['src'],
          tagName: 'IMAGE',
        })
      } else {
        tempArrayToClassifyHTMLMElement.push({
          textContent: htmlElement.textContent,
          tagName: htmlElement.tagName,
        })
      }
    // debugger
    }
  }

  classifiedHtmlElement.forEach((
    item: { tagName: string; textContent: string }[],
  ) => {

    let imageIsNotPast = true
    let listIsPast = false
    const tempsDescription = ""

    item.reduceRight((
      previousProperty: { tagName: string; textContent: string },
      property: { tagName: string; textContent: string },
      propertyIndex: number,
    ) => {

      if (propertyIndex === 1) {
        item.splice(propertyIndex, 1, {
          textContent: property.textContent.split('\n')[0],
          tagName: property.tagName,
        })

        if (property.textContent.split('\n')[1])
          item.splice(propertyIndex + 1, 0, {
            textContent: property.textContent.split('\n')[1],
            tagName: property.tagName,
          })

        // debugger
      }

      if (property.textContent === '') item.splice(propertyIndex, 1)

      if(
        imageIsNotPast
        && property.tagName === 'P'
        && previousProperty.tagName === 'P'
      ) {
        item.splice(propertyIndex, 1)
        previousProperty.textContent += '\n\n' + property.textContent
      }


      if(property.tagName === 'IMAGE') imageIsNotPast = false

      return property
    })
  })

  console.log(classifiedHtmlElement)

  debugger

}
main()

