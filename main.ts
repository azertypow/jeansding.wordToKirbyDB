import {readFile, writeFile, mkdir, copyFile} from 'fs/promises'
import {existsSync} from 'fs'
import {parse, HTMLElement} from 'node-html-parser'
import {ObjectItem} from "./ObjectItem"

async function main() {

const imageTemplate =
`
Sort: 1

----

Caption: 

----

Template: image
`

  const contentMDFile =
    await readFile(
      './outputHTML/output.html',
      {
        encoding: 'utf8',
      },
    )

  const parsed = parse(contentMDFile, {})

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
        previousProperty.textContent = property.textContent + '\n\n' + previousProperty.textContent
      }


      if(property.tagName === 'IMAGE') imageIsNotPast = false

      return property
    })
  })

  const items: ObjectItem[] = classifiedHtmlElement.map(value => {
    return new ObjectItem({
      id:         value[0].textContent,
      tags:       value[1].textContent.split(','),
      title:      value[2].textContent,
      imgName:    value[3].textContent.replace('./media/', ''),
      text:       value[4].textContent,
      infoObject:     value[5].textContent.split('\n').find(tagLineValue => {return tagLineValue.match('Object:')}    )?. replace('Object:',      '').trim() || 'NULL',
      infoMaterial:   value[5].textContent.split('\n').find(tagLineValue => {return tagLineValue.match('Material:')}  )?. replace('Material:',    '').trim() || 'NULL',
      infoDate:       value[5].textContent.split('\n').find(tagLineValue => {return tagLineValue.match('Date:')}      )?. replace('Date:',        '').trim() || 'NULL',
      infoLocation:   value[5].textContent.split('\n').find(tagLineValue => {return tagLineValue.match('Location:')}  )?. replace('Location:',    '').trim() || 'NULL',
      infoMade_in:    value[5].textContent.split('\n').find(tagLineValue => {return tagLineValue.match('Made in:')}   )?. replace('Made in:',     '').trim() || 'NULL',
      infoPrice:      value[5].textContent.split('\n').find(tagLineValue => {return tagLineValue.match('Price:')}     )?. replace('Price:',       '').trim() || 'NULL',
      infoDimensions: value[5].textContent.split('\n').find(tagLineValue => {return tagLineValue.match('Dimensions:')})?. replace('Dimensions:',  '').trim() || 'NULL',
      infoLoan:       value[5].textContent.split('\n').find(tagLineValue => {return tagLineValue.match('Loan:')}      )?. replace('Loan:',        '').trim() || 'NULL',
    })
  })

  items.forEach((item, index) => {

    const dirPath = `./outputKirbyFiles/${index}_${encodeURI(item.props.id)}/`
    const srcImgPath = "./outputHTML/media/"

    mkdir(dirPath).then(() => {
      writeFile(
        `${dirPath}object.txt`,
        item.createStringDocument(),
        {encoding: 'utf8',}
      )


      const imgPath = `${srcImgPath}${item.props.imgName}`

      if(existsSync( imgPath )) {
        const newImagePath = `${dirPath}${item.newImageName}`

        copyFile(imgPath, newImagePath)

        writeFile(
          `${newImagePath}.txt`,
          imageTemplate,
          {encoding: 'utf8',}
        )
      }
    })

      // props.id + props.title,
  })

  debugger

}
main()
