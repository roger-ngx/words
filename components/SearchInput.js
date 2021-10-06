import { useState } from 'react';
import { IconButton, InputBase, Paper } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { trim } from 'lodash';

const SearchInput = ({onClick}) => {
    const [ searchValue, setSearchValue ] = useState('');

    const onSearch = () => {
        onClick(searchValue);
    }

    return (
        <Paper
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: '0 0 0 8px'
            }}
        >
            <InputBase
                placeholder='project name search'
                value={searchValue}
                onChange={e => setSearchValue(trim(e.target.value))}
                onKeyDown={e => e.key==='Enter' && onSearch()}
            />
            <IconButton onClick={onSearch}>
                <Search />
            </IconButton>
        </Paper>
    )
}

export default SearchInput;