import axios from 'axios'

const endpoint = "http://localhost:4001/api/central/graphql?query="

const graphql = {
  run: (query) => {
    return axios.post(`${endpoint}${prepare(query)}`)
      .then((res) => res.data.data)
  }
}

function prepare(query) {
  return query.replace(/\s+/g, ' ')
}

export default graphql
