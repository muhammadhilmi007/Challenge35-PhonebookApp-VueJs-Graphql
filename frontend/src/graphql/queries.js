import { gql } from '@apollo/client/core'

export const GET_CONTACTS = gql`
  query GetContacts($search: String, $sortBy: String, $sortOrder: String, $offset: Int, $limit: Int) {
    contacts(search: $search, sortBy: $sortBy, sortOrder: $sortOrder, offset: $offset, limit: $limit) {
      id
      name
      phone
      photo
    }
    totalContacts(search: $search)
  }
`