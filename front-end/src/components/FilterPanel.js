import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'


const FilterPanel = () => {

  // all museums returned from axios GET request
  const [allMuseums, setAllMuseums] = useState(null)

  // value of Region dropdown
  const [selectedRegion, setSelectedRegion] = useState(null)

  // array of all collection types selected using checkboxes
  const [selectedCollections, setSelectedCollections] = useState([])

  // array of museum objects, filtered by region and collection
  const [filteredMuseumsArr, setFilteredMuseumsArr] = useState([])

  // error handling
  const [hasError, setHasError] = useState(false)


  //* axios API request to GET ALL MUSEUMS, runs once on first render *//

  useEffect(() => {

    const getAllMuseumsData = async () => {
      try {
        const { data } = await axios.get('/api/museums')
        setAllMuseums(data)
      } catch (err) {
        console.log(err)
        setHasError(true)
      }
    }
    getAllMuseumsData()

  }, [])


  //* handleChange function, updates selectedRegion or selectedCollections on each interaction with Region dropdown or collection types checkboxes *//

  const handleChange = (event) => {
    if (event.target.name === 'regions') {
      setSelectedRegion(event.target.value)
    } else {
      if (event.target.checked) {
        const newSelectedCollections = [...selectedCollections, event.target.name]
        setSelectedCollections(newSelectedCollections)
      } else if (!event.target.checked) {
        const updatedSelectedCollections = selectedCollections.filter(collection => {
          return collection !== event.target.name
        })
        setSelectedCollections(updatedSelectedCollections)
      }
    }
  }


  //* Every time selectedRegion or selectedCollections updates, this useEffect filters allMuseums, storing the appropriate museum objects in filteredMuseumsArr *//

  useEffect(() => {

    if (selectedCollections.length === 0 && !selectedRegion) {

      return //* Return if no collections selected AND no region selected

    } else if (selectedCollections.length === 0 && selectedRegion) { //* if no collections selected but a region selected
      console.log(`selectedCollections is empty array, selectedRegion is ${selectedRegion}`)

      const regionFilteredMuseums = allMuseums.filter(museum => {
        return museum.region === selectedRegion
      })
      setFilteredMuseumsArr(regionFilteredMuseums)

    } else if (selectedCollections.length !== 0 && (!selectedRegion || selectedRegion === 'Region')) { //* if one or more collections selected but no region selected (selectedRegion has no value OR its value is 'Region')
      console.log(`selectedCollections array contains ${selectedCollections.length} collections, NO selectedRegion`)

      let filteredByCollections = []

      for (let i = 0; i < selectedCollections.length; i++) { //* for every item in the selectedCollections array:
        const collectionFilteredMuseums = allMuseums.filter(museum => { //* filter through the allMuseums array
          return museum.collection_types.includes(selectedCollections[i]) //* for each museum object, if museum.collection_types array contains selectedCollections[i], store it in the collectionFilteredMuseums (array)
        })
        filteredByCollections = [...filteredByCollections, ...collectionFilteredMuseums] //* update the value of filteredByCollections array, spreading in collectionFilteredMuseums - the result is an array containing duplicates
      }

      //* De-duplicate the filteredByCollections array of museum objects:
      const filteredByCollectionsDeduplicated = [...new Set(filteredByCollections)] //* uses JS 'Set' constructor to create a collection of unique items (of any data type), where each item can only occur once in the Set
      //* The 'new Set()' is spread into an array, because otherwise the 'new Set()' on is own here would be an object full of museum objects (as opposed to array full of museum objects)
      setFilteredMuseumsArr(filteredByCollectionsDeduplicated) //* set the value of the filteredMuseumsArr piece of state to the value of the de-duplicated array

    } else if (selectedCollections.length !== 0 && selectedRegion) { //* if one or more collections selected AND a region selected
      console.log(`selectedCollections array contains ${selectedCollections.length} collections, selectedRegion is ${selectedRegion}`)

      let filteredByCollections = []
      let filteredByBoth = []

      for (let i = 0; i < selectedCollections.length; i++) {
        const collectionFilteredMuseums = allMuseums.filter(museum => {
          return museum.collection_types.includes(selectedCollections[i])
        })
        filteredByCollections = [...filteredByCollections, ...collectionFilteredMuseums]
      }

      if (filteredByCollections.length !== 0) {
        filteredByBoth = filteredByCollections.filter(museum => {
          return museum.region === selectedRegion
        })
      }

      //* De-duplicate the filteredByBoth array of museum objects:
      const filteredByBothDeduplicated = [...new Set(filteredByBoth)]
      setFilteredMuseumsArr(filteredByBothDeduplicated) //* set the value of the filteredMuseumsArr piece of state to the value of the de-duplicated array

    }

  }, [selectedCollections, selectedRegion])



  //* console.logs for testing *//

  // console.log('All Museums from GET request ->', allMuseums)
  // console.log('selectedRegion ->', selectedRegion)
  // console.log('selectedCollections ->', selectedCollections)
  console.log('FILTEREDMUSEUMSARR ->', filteredMuseumsArr)



  return (
    <section className='has-background-warning'>
      {!hasError ?
        <div className='field is-horizontal is-grouped is-grouped-centered'>
          <div className='field-body'>
            <div className='field'>
              <div className='control'>
                <div className='select is-danger'>
                  <select className='has-background-warning-light has-text-weight-bold' id='filter-panel' name='regions' onChange={handleChange}>
                    <option value='Region'>Region</option>
                    <option value='East of England'>East of England</option>
                    <option value='East Midlands'>East Midlands</option>
                    <option value='London'>London</option>
                    <option value='North East'>North East</option>
                    <option value='North West'>North West</option>
                    <option value='South East'>South East</option>
                    <option value='South West'>South West</option>
                    <option value='West Midlands'>West Midlands</option>
                    <option value='Yorkshire and the Humber'>Yorkshire and the Humber</option>
                  </select>
                </div>
              </div>
            </div>
            <div className='field'>
              <div className='control'>
                <label className='label is-fullwidth'>Collection types:</label>
              </div>
            </div>
            <div className='field'>
              <div className='control'>
                <label className='checkbox'>
                  <input type='checkbox' name='geology' onChange={handleChange} />
                  Geology
                </label>
              </div>
            </div>
            <div className='field'>
              <div className='control'>
                <label className='checkbox'>
                  <input type='checkbox' name='palaeontology' onChange={handleChange} />
                  Palaeontology
                </label>
              </div>
            </div>
            <div className='field'>
              <div className='control'>
                <label className='checkbox'>
                  <input type='checkbox' name='botany' onChange={handleChange} />
                  Botany
                </label>
              </div>
            </div>
            <div className='field'>
              <div className='control'>
                <label className='checkbox'>
                  <input type='checkbox' name='zoology' onChange={handleChange} />
                  Zoology
                </label>
              </div>
            </div>
            <div className='field'>
              <div className='control'>
                <label className='checkbox'>
                  <input type='checkbox' name='entomology' onChange={handleChange} />
                  Entomology (insects)
                </label>
              </div>
            </div>
            <div>
              <div className='control'>
                <Link to={{ pathname: '/filteredmuseums', state: filteredMuseumsArr }} className='button is-link has-background-danger has-text-white has-text-weight-bold is-fullwidth'>Find museums!</Link>
              </div>
            </div>
          </div>
        </div>
        :
        <div></div> // If there is an error (caused by an issue with the axios GET request on first render), FilterPanel will disappear
      }

    </section>
  )

}

export default FilterPanel