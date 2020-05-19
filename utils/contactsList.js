export const getHeaders = (contacts) => {
  let letters = contacts
    .map((contactObj) => contactObj.name[0].toUpperCase())
    .sort();

  const uniques = [...new Set(letters)];

  return uniques.map((letter) => ({ title: letter, data: [] }));
};

export const createSectionedData = (arrayOfContacts) => {
  let contacts = arrayOfContacts;
  const data = getHeaders(contacts);

  contacts.forEach((obj) => {
    const firstLetter = obj.name[0].toUpperCase();
    const index = data.findIndex((obj) => obj.title === firstLetter);
    obj.checked = false;
    data[index].data.push(obj);
  });

  return data;
};

export const findIndices = (
  contactName,
  contactId,
  arrayOfSectionedContacts
) => {
  const firstLetter = contactName[0].toUpperCase();
  const sectionIndex = arrayOfSectionedContacts.findIndex(
    (obj) => obj.title === firstLetter
  );

  const nameIndex = arrayOfSectionedContacts[sectionIndex].data.findIndex(
    (obj) => obj.id === contactId
  );

  return { sectionIndex, nameIndex };
};
