export const sortCategory = (category: Tcategory[]) => {
  category.sort((a: Tcategory, b: Tcategory) => {
    if (a.label && b.label) {
      const nameA = a.label.toUpperCase() // ignore upper and lowercase
      const nameB = b.label.toUpperCase() // ignore upper and lowercase
      if (nameA < nameB) {
        return -1
      }
      if (nameA > nameB) {
        return 1
      }
    }

    // 이름이 같을 경우
    return 0
  })

  return category
}