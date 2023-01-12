import PocketBase from 'pocketbase'

const pb = new PocketBase('http://10.123.10.211:8090')
global.pb = pb

const collectionName = 'discord'

const getRecords = async () => {
  const records = await pb.collection(collectionName).getFullList()
  // console.log(records)

  const data = await Promise.all(
    records.map(
      async ({ id, created, updated, username, userID, userData }) => {
        // const user = await getAuthor(author)
        // const edited = created != updated ? updated : null
        const edited = created != updated
        return {
          id,
          created,
          updated,
          edited,
          username,
          userID,
          userData,
        }
      }
    )
  )

  return data
}

const getRecord = async (recordId) => {
  const record = await pb.collection(collectionName).getOne(recordId)
  console.log(record)

  const edited = record.created != record.updated

  const data = {
    id: record.id,
    created: record.created,
    updated: record.updated,
    edited,
    username: record.username,
    userID: record.userID,
    userData: record.userData,
  }

  return data
}

const search = async (filter) => {

  let record
  try {
    record = await pb.collection(collectionName).getFirstListItem(filter)
  } catch (error) {
    if (error.name == 'ClientResponseError 404') {
      return {
        error: true,
        reason: '404',
      }
    }

    return {
      error: true,
      reason: error,
    }
  }

  // console.log(record)

  const edited = record.created != record.updated

  const data = {
    id: record.id,
    created: record.created,
    updated: record.updated,
    edited,
    username: record.username,
    userID: record.userID,
    userData: record.userData,
  }

  return data
}

const createRecord = async (recordData) => {
  const record = await pb.collection(collectionName).create({
    ...recordData,
  })
}

const editRecord = async (recordId, recordData) => {
  const record = await pb.collection(collectionName).update(recordId, {
    ...recordData,
  })
}

const deleteRecord = async (recordId) => {
  await pb.collection(collectionName).delete(recordId)
}

export {
  pb,
  getRecords,
  getRecord,
  createRecord,
  editRecord,
  deleteRecord,
  search,
}
