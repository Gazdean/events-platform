import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton'
import FilterButtonOptions from './FilterButtonOptions';

export default function FilterButton({catLoading, categories, setFilteredCat}) {

  return (
    <DropdownButton id="dropdown-item-button" title="Filter Events By Category">
      <FilterButtonOptions categories={categories} catLoading={catLoading} setFilteredCat={setFilteredCat} />
    </DropdownButton>
  )
}