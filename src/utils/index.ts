import type { ParsedQuestionData } from "../types"

export const labelOptions = (index: number) => {
   return String.fromCharCode(65 + index) + ".";
}

export const capitalizeFirstLetter = (value: string) => {
   return value.charAt(0).toUpperCase() + value.slice(1);
};

const TEACHERS_KEY = 'docentes';

export const getTeachers = (): { id: string; name: string }[] => {
   const data = localStorage.getItem(TEACHERS_KEY);
   return data ? JSON.parse(data) : [];
};

export const saveTeachers = (teachers: { id: string; name: string }[]): void => {
   localStorage.setItem(TEACHERS_KEY, JSON.stringify(teachers));
};

export const hasTeachers = (): boolean => {
   return getTeachers().length > 0;
};

const parseHTML = (html: string) => {
   return new DOMParser().parseFromString(html, 'text/html')
}

export const parseQuestionsFromXML = (xmlString: string): {
   questions: ParsedQuestionData[]
   teacherNames: string[]
} => {
   const xmlDoc = new DOMParser().parseFromString(xmlString, 'text/xml')
   const questionNodes = xmlDoc.querySelectorAll('question[type="multichoice"]')
   const questions: ParsedQuestionData[] = []
   const teacherNamesSet = new Set<string>()

   questionNodes.forEach(qNode => {
      const nameText = qNode.querySelector('name > text')?.textContent || ''
      const teacherName = nameText.split('—').map(s => s.trim())[1] || 'Sin docente'
      teacherNamesSet.add(teacherName)

      const qtNode = qNode.querySelector('questiontext')
      const cdData = qtNode?.querySelector('text')?.textContent || ''
      const htmlDoc = parseHTML(cdData)

      const firstP = htmlDoc.querySelector('p')
      const questionText = firstP?.textContent?.trim() || ''

      const fileNode = qtNode?.querySelector('file')
      let image: string | undefined
      if (fileNode) {
         const base64 = (fileNode.textContent || '').replace(/\s/g, '')
         const fileName = fileNode.getAttribute('name') || ''
         const ext = fileName.split('.').pop() || 'png'
         const mimeMap: Record<string, string> = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp' }
         image = `data:${mimeMap[ext] || 'image/png'};base64,${base64}`
      }

      const answerNodes = qNode.querySelectorAll('answer')
      const options: { text: string; correct: boolean }[] = []
      answerNodes.forEach(aNode => {
         const fraction = aNode.getAttribute('fraction') || '0'
         const aText = aNode.querySelector('text')?.textContent?.trim() || ''
         const aHtml = parseHTML(aText)
         const text = aHtml.querySelector('p')?.textContent?.trim() || aText
         options.push({ text, correct: fraction === '100' })
      })

      const feedbackHtml = qNode.querySelector('incorrectfeedback > text')?.textContent || ''
      const feedbackDoc = parseHTML(feedbackHtml)
      const feedbackPs = feedbackDoc.querySelectorAll('p')
      const feedback = feedbackPs.length > 1 ? feedbackPs[1]?.textContent?.trim() || '' : ''

      questions.push({ questionText, feedback, options, teacherName, image })
   })

   return { questions, teacherNames: Array.from(teacherNamesSet) }
}