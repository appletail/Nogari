import { json } from 'stream/consumers'

import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'

import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Grid,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  Link,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  TextField,
} from '@mui/material'

// lodash
import { filter } from 'lodash'

// components
import POSTLIST from '../_mock/tistory'

import Iconify from '@/components/iconify'
// import Label from '@/components/label'
import Scrollbar from '@/components/scrollbar'
import TistoryListHead from '@/sections/home/table/TistoryListHead'

const TABLE_HEAD = [
  { id: 'blog_name', label: '블로그 선택', alignRight: false },
  { id: 'request_link', label: '요청페이지 링크', alignRight: false },
  { id: 'visibility', label: '공개여부', alignRight: false },
  { id: 'category_name', label: '카테고리', alignRight: false },
  { id: 'tags', label: '태그', alignRight: false },
  { id: 'modified_at', label: '발행일자', alignRight: false },
  { id: 'status', label: '발행상태', alignRight: false },
  { id: 'title', label: '제목', alignRight: false },
  { id: '' },
]

interface ITistoryPost {
  id: string
  visibility: number
  status: string
  title: string
  category_name: string
  modified_at: string
  blog_name: string
  request_link: string
  response_link: string
  tags: string
}

function TistoryPage() {
  const [open, setOpen] = useState(null)

  const [page, setPage] = useState(0)

  const [order, setOrder] = useState<'asc' | 'desc'>('asc')

  const [selected, setSelected] = useState<string[]>([])

  const [orderBy, setOrderBy] = useState('title')

  const [filterName, setFilterName] = useState('')

  const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleRequestSort = (event: any, property: any) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event: any) => {
    if (event.target.checked) {
      const newSelecteds = POSTLIST.map((n) => n.title)
      setSelected(newSelecteds)
      return
    }
    setSelected([])
  }

  const handleClick = (event: any, title: any) => {
    const selectedIndex = selected.indexOf(title)
    let newSelected: any = []
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, title)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }
    setSelected(newSelected)
  }
  const handleOpenMenu = (event: any) => {
    setOpen(event.currentTarget)
  }
  const handleCloseMenu = () => {
    setOpen(null)
  }

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: any) => {
    setPage(0)
    setRowsPerPage(parseInt(event.target.value, 10))
  }
  //------------------------------------------------------------------------
  function descendingComparator(a: any, b: any, orderBy: any) {
    if (b[orderBy] < a[orderBy]) {
      return -1
    }
    if (b[orderBy] > a[orderBy]) {
      return 1
    }
    return 0
  }

  function getComparator(order: any, orderBy: any) {
    return order === 'desc'
      ? (a: any, b: any) => descendingComparator(a, b, orderBy)
      : (a: any, b: any) => -descendingComparator(a, b, orderBy)
  }

  function applySortFilter(array: any, comparator: any, query: any) {
    const stabilizedThis = array.map((el: any, index: any) => [el, index])
    stabilizedThis.sort((a: any, b: any) => {
      const order = comparator(a[0], b[0])
      if (order !== 0) return order
      return a[1] - b[1]
    })
    if (query) {
      return filter(
        array,
        (_user) => _user.title.toLowerCase().indexOf(query.toLowerCase()) !== -1
      )
    }
    return stabilizedThis.map((el: any) => el[0])
  }

  const filteredPosts = applySortFilter(
    POSTLIST,
    getComparator(order, orderBy),
    filterName
  )

  return (
    <>
      <Helmet>
        <title> Tistory Page </title>
      </Helmet>

      <Container>
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          mb={5}
        >
          <Typography gutterBottom variant="h4">
            Tistory
          </Typography>
        </Stack>
        <Card>
          <Scrollbar>
            <TableContainer
            // style={{ overflowX: 'initial' }}
            // sx={{ minWidth: 800 }}
            >
              <Table stickyHeader>
                <TistoryListHead
                  headLabel={TABLE_HEAD}
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  rowCount={POSTLIST.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />

                <TableBody>
                  {filteredPosts
                    // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row: any) => {
                      const {
                        id,
                        visibility,
                        status,
                        title,
                        category_name,
                        modified_at,
                        blog_name,
                        request_link,
                        response_link,
                        tags,
                      } = row
                      const selectedUser = selected.indexOf(title) !== -1

                      return (
                        <TableRow
                          key={id}
                          hover
                          // role="checkbox"
                          selected={selectedUser}
                          tabIndex={-1}
                        >
                          <TableCell align="left">{blog_name}</TableCell>
                          <TableCell align="left">{request_link}</TableCell>

                          <TableCell align="left">
                            {visibility === 0 ? '비공개' : '공개'}
                            {/* <TextField /> */}
                          </TableCell>

                          <TableCell align="left">{category_name}</TableCell>
                          <TableCell align="left">{tags}</TableCell>
                          <TableCell align="center">
                            {JSON.stringify(modified_at)}
                          </TableCell>
                          <TableCell align="left">{status}</TableCell>
                          <TableCell align="left">
                            <Link href={response_link}>{title}</Link>
                          </TableCell>

                          <TableCell align="right">
                            <IconButton
                              color="inherit"
                              size="large"
                              onClick={handleOpenMenu}
                            >
                              <Iconify icon={'eva:more-vertical-fill'} />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
          <TablePagination
            component="div"
            count={POSTLIST.length}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        anchorEl={open}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        open={Boolean(open)}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
        onClose={handleCloseMenu}
      >
        <MenuItem>
          <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        {/* 미추 : 발행기록 삭제 */}
        {/* <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
          Delete
        </MenuItem> */}
      </Popover>
    </>
  )
}

export default TistoryPage
