import {convertToHtml} from 'mammoth'

async function main() {
  const htmlFromDocx = await convertToHtml({
    path: './20220803-Jeansdinge_430finalenglish.docx',
  }, {

  })

  console.log( htmlFromDocx )
}
main()
