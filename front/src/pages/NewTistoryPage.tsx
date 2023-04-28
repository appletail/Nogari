import React, { useState, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'

import { faker } from '@faker-js/faker'

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
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridCellParams,
  GridCellModesModel,
  GridCellModes,
} from '@mui/x-data-grid'

import { sample, sampleSize } from 'lodash'

import Scrollbar from '@/components/scrollbar/Scrollbar'

function NewTistoryPage() {
  const [rows, setRows] = useState(predefinedRows)
  const [cellModesModel, setCellModesModel] = useState<GridCellModesModel>({})

  const processRowUpdate = (newRow: any, oldRow: any) => {
    setRows((prevRows) => {
      const newRows = [...prevRows].map((row) => {
        if (row.id === newRow.id) return newRow
        return row
      })
      return newRows
    })
    // the DataGrid expects the newRow as well
    return newRow
  }
  const onClickHandler = () => {
    console.log(rows)
  }

  const handleCellClick = useCallback((params: GridCellParams) => {
    setCellModesModel((prevModel: any) => {
      return {
        // Revert the mode of the other cells from other rows
        ...Object.keys(prevModel).reduce(
          (acc, id) => ({
            ...acc,
            [id]: Object.keys(prevModel[id]).reduce(
              (acc2, field) => ({
                ...acc2,
                [field]: { mode: GridCellModes.View },
              }),
              {}
            ),
          }),
          {}
        ),
        [params.id]: {
          // Revert the mode of other cells in the same row
          ...Object.keys(prevModel[params.id] || {}).reduce(
            (acc, field) => ({ ...acc, [field]: { mode: GridCellModes.View } }),
            {}
          ),
          [params.field]: { mode: GridCellModes.Edit },
        },
      }
    })
  }, [])

  const handleCellModesModelChange = useCallback((newModel: any) => {
    setCellModesModel(newModel)
  }, [])

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
          <Button onClick={onClickHandler}>Get data</Button>
        </Stack>
        <Card>
          <Scrollbar>
            <div style={{ height: 300, width: '100%' }}>
              <DataGrid
                cellModesModel={cellModesModel}
                columns={columns}
                experimentalFeatures={{}}
                processRowUpdate={processRowUpdate}
                rows={rows}
                onCellClick={handleCellClick}
                onCellModesModelChange={handleCellModesModelChange}
              />
            </div>
          </Scrollbar>
        </Card>
      </Container>
    </>
  )
}

const columns: GridColDef[] = [
  {
    field: 'blog_name',
    headerName: '블로그 선택',
    width: 180,
    editable: true,
    disableColumnMenu: true,
    hideSortIcons: true,
  },
  {
    field: 'request_link',
    headerName: '요청페이지 링크',
    editable: true,
    disableColumnMenu: true,
    hideSortIcons: true,
  },
  {
    field: 'visibility',
    headerName: '공개여부',
    editable: true,
    type: 'singleSelect',
    valueOptions: ['공개', '비공개'],
    disableColumnMenu: true,
  },
  {
    field: 'category_name',
    headerName: '카테고리',
    type: 'singleSelect',
    valueOptions: ['cate1', 'cate2', 'cate3'],
    editable: true,
    disableColumnMenu: true,
  },
  {
    field: 'tags',
    headerName: '태그',
    editable: true,
    disableColumnMenu: true,
    hideSortIcons: true,
  },
  {
    field: 'modified_at',
    headerName: '발행일자',
    type: 'date',
    width: 180,
    editable: true,
    hideable: false,
    disableColumnMenu: true,
  },
  {
    field: 'status',
    headerName: '발행상태',
    type: 'singleSelect',
    width: 220,
    editable: true,
    hideable: false,
    valueOptions: ['발행요청', '발행완료', '수정요청'],
    disableColumnMenu: true,
  },
  {
    field: 'title',
    headerName: '제목',
    disableColumnMenu: true,
    hideSortIcons: true,
  },
]

const POST_TITLES = [
  'Whiteboard Templates By Industry Leaders',
  'Tesla Cybertruck-inspired camper trailer for Tesla fans who can’t just wait for the truck!',
  'Designify Agency Landing Page Design',
  '✨What is Done is Done ✨',
  'Fresh Prince',
  'Six Socks Studio',
  'vincenzo de cotiis’ crossing over showcases a research on contamination',
  'Simple, Great Looking Animations in Your Project | Video Tutorial',
  '40 Free Serif Fonts for Digital Designers',
  'Examining the Evolution of the Typical Web Design Client',
  'Katie Griffin loves making that homey art',
  'The American Dream retold through mid-century railroad graphics',
  'Illustration System Design',
  'CarZio-Delivery Driver App SignIn/SignUp',
  'How to create a client-serverless Jamstack app using Netlify, Gatsby and Fauna',
  'Tylko Organise effortlessly -3D & Motion Design',
  'RAYO ?? A expanded visual arts festival identity',
  'Anthony Burrill and Wired mag’s Andrew Diprose discuss how they made January’s Change Everything cover',
  'Inside the Mind of Samuel Day',
  'Portfolio Review: Is This Portfolio Too Creative?',
  'Akkers van Margraten',
  'Gradient Ticket icon',
  'Here’s a Dyson motorcycle concept that doesn’t ‘suck’!',
  'How to Animate a SVG with border-image',
]

const TAGS = [
  'python',
  'react',
  'java',
  'javascript',
  'ssafy',
  '조퇴',
  '설렁탕',
  '딘딘',
  '알고리즘',
  'algorithm',
  'n2t',
  'notion',
  'md',
  'markdown',
  '퍼레이드',
  'jennifer',
  'brad',
  'eddy',
  'daniel',
  'sally',
  'spring',
  '김영한',
  '자율프로젝트',
  '특화프로젝트',
  '공통프로젝트',
  '개발자',
  'pm',
  'FE',
  '백엔드',
  '데브옵스',
]

const BLOG_NAMES = [
  '딘딘의 재롱잔치',
  '팬더의 공학일기',
  '통계학 세상',
  '뉴비코의 코딩일기',
  '개발자 뭄뭄',
  '기억보단 기록을',
  '노션 투 티스토리',
  '미미가 양꼬치',
  '사랑해요 제로딘딘',
]

const predefinedRows: GridRowsProp = [...Array(23)].map((_, index) => ({
  id: faker.datatype.uuid(),
  visibility: sample([0, 3]),
  status: sample(['발행완료', '발행요청', '수정요청', '발행오류']),
  title: POST_TITLES[index + 1],
  category_name: sample(['cate1', 'cate2', 'cate3']),
  modified_at: faker.date.past(),
  blog_name: sample(BLOG_NAMES),
  request_link: faker.internet.domainName(),
  response_link: faker.internet.domainName(),
  tags: sampleSize(TAGS, sample([2, 4, 5, 6, 8])).toString(),
}))

export default NewTistoryPage
