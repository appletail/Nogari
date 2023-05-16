import React, { useState, useCallback, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery, useQueryClient, useMutation } from 'react-query'

import { faker } from '@faker-js/faker'
import LoginIcon from '@mui/icons-material/Login'
import { Card, Stack, Button, Typography, IconButton } from '@mui/material'
import { styled } from '@mui/material/styles'
import {
  DataGrid,
  GridColDef,
  GridEditSingleSelectCellProps,
  GridCellParams,
  GridEditSingleSelectCell,
  GridCellModesModel,
  GridCellModes,
  useGridApiRef,
} from '@mui/x-data-grid'

import { sample, sampleSize } from 'lodash'

import { getOauthStatus } from '@/apis/OauthApis'
import { postTistoryPostList, postTistoryPost } from '@/apis/tistoryApis'
import { ReactComponent as Tistory } from '@/assets/logos/tistory.svg'

import Scrollbar from '@/components/scrollbar/Scrollbar'

// ------------------------------------------------------------------
interface posting {
  id: string
  visibility: number
  status: string
  title: string
  categoryName: string
  modifiedDate: string
  blogName: string
  requestLink: string
  tagList: string
}

interface CustomTypeEditComponentProps extends GridEditSingleSelectCellProps {
  setRows: React.Dispatch<React.SetStateAction<any[]>>
}

interface tistoryCategory {
  id: string
  name: string
  parent: string
  label: string
  entries: string
}

function CustomTypeEditComponent(props: CustomTypeEditComponentProps) {
  const { setRows, ...other } = props

  const handleValueChange = () => {
    setRows((prevRows) => {
      // console.log(prevRows)
      return prevRows.map((row) =>
        row.id === props.id ? { ...row, categoryName: null } : row
      )
    })
  }

  return (
    <GridEditSingleSelectCell onValueChange={handleValueChange} {...other} />
  )
}

// ------------------------------------------------------------------

function TistoryPage() {
  // tistory 연결 여부에 따라 Button 다르게 보이는 부분 설정
  // react query를 사용해서 sidebar에서 받은 로그인 정보 저장
  // tistory가 연결되어 있을 때에만 tistoryInfo를 받아옵니다.

  const apiRef = useGridApiRef()
  const { isLoading, data: oauth } = useQuery('oauths', getOauthStatus)
  const { data: tistoryInfo, refetch } = useQuery(
    'tistoryInfo',
    postTistoryPostList,
    {
      enabled: !!oauth,
    }
  )

  // data grid에서 사용하는 state
  // row data and blog name
  const [rows, setRows] = useState<any[]>([])
  const [blogName, setBlogName] = useState(tistoryInfo?.data.result[1] || [''])

  // cell mode : edit or view
  const [cellModesModel, setCellModesModel] = useState<GridCellModesModel>({})

  useEffect(() => {
    if (tistoryInfo) {
      const RowData = tistoryInfo.data.result[0]
      setRows(RowData)
      setBlogName(tistoryInfo?.data.result[1])
    }
  }, [tistoryInfo])

  // 새로운 행을 만드는 함수
  const createNewRow = () => {
    return {
      tistoryId: faker.datatype.uuid(),
      visibility: 3,
      status: '발행요청',
      title: '',
      categoryName: '',
      modifiedDate: '',
      blogName: blogName[0],
      requestLink: '',
      tagList: '',
    }
  }

  // add row 에 관련된 새로운 함수
  const handleAddRow = () => {
    const newRow = createNewRow()
    const newRows = [newRow, ...rows]
    setRows(newRows)
  }

  // data 제출 시에 사용하는 함수
  const onClickHandler = async () => {
    const rowModels = apiRef.current.getRowModels()
    const submitArray: any[] = []
    rowModels.forEach((row) => {
      // 발행 할 데이터 링크가 있고 발행요청 혹은 수정요청인 경우에만 발행
      if (
        row.requestLink &&
        (row.status === '발행요청' || row.status === '수정요청')
      ) {
        row['type'] = 'html'
        submitArray.push(row)
      }
    })

    // 발행할 최종 데이터 리스트가 있는 경우에만 post 요청을 보냅니다
    if (submitArray.length !== 0) {
      const response = await postTistoryPost(submitArray)
      console.log(response)
      // api 호출에 성공한 경우에만 refetch 진행
      if (response.data.resultCode === 200) {
        refetch()
        const newData = rows
        apiRef.current.setRows(newData)
      }
    }
  }

  // 더블클릭 > 클릭 시 수정으로 변경
  const handleCellClick = useCallback((params: GridCellParams) => {
    setCellModesModel((prevModel: any) => {
      return {
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
          ...Object.keys(prevModel[params.id] || {}).reduce(
            (acc, field) => ({
              ...acc,
              [field]: { mode: GridCellModes.View },
            }),
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

  const visibilityOptions = [
    { value: 0, label: '비공개' },
    { value: 3, label: '공개' },
  ]

  const columns: GridColDef[] = [
    {
      field: 'blogName',
      headerName: '블로그 선택',
      type: 'singleSelect',
      valueOptions: blogName,
      width: 180,
      editable: true,
      disableColumnMenu: true,
      hideSortIcons: true,
      renderEditCell: (params) => (
        <CustomTypeEditComponent setRows={setRows} {...params} />
      ),
    },
    {
      field: 'requestLink',
      headerName: '요청페이지 링크',
      width: 220,
      editable: true,
      disableColumnMenu: true,
      hideSortIcons: true,
    },
    {
      field: 'visibility',
      headerName: '공개여부',
      editable: true,
      type: 'singleSelect',
      valueOptions: visibilityOptions,
      disableColumnMenu: true,
    },
    {
      field: 'categoryName',
      headerName: '카테고리',
      type: 'singleSelect',

      valueOptions: ({ row }) => {
        if (!row) {
          return [{ value: '', label: '카테고리없음' }]
        }

        const index = blogName.indexOf(row.blogName)
        const selectedCategories = tistoryInfo?.data.result[2][index]
        return selectedCategories
          ? selectedCategories.map((category: tistoryCategory) => {
              return { value: category.id, label: category.name }
            })
          : [{ value: '', label: '카테고리없음' }]
      },
      editable: true,
      disableColumnMenu: true,
    },
    {
      field: 'tagList',
      headerName: '태그',
      editable: true,
      disableColumnMenu: true,
      hideSortIcons: true,
    },
    {
      field: 'modifiedDate',
      headerName: '발행일자',
      width: 120,
      editable: true,
      hideable: false,
      disableColumnMenu: true,
    },
    {
      field: 'status',
      headerName: '발행상태',
      type: 'singleSelect',
      width: 100,
      editable: true,
      hideable: false,
      valueOptions: ['발행요청', '발행완료', '수정요청', '발행실패'],
      disableColumnMenu: true,
    },
    {
      field: 'title',
      headerName: '제목',
      disableColumnMenu: true,
      hideSortIcons: true,
      editable: false,
      flex: 1,
      minWidth: 50,
    },
  ]

  const tistoryLoginURL = import.meta.env.VITE_TISTORY_OAUTH_URL

  return (
    <>
      <Helmet>
        <title> Tistory </title>
      </Helmet>

      {/* 티스토리 아이콘 & 로그인 */}
      <Stack alignItems="center" direction="row" mb={5}>
        <Stack alignItems="center" direction="row" spacing={1}>
          <Tistory style={{ width: 24, height: 24 }} />
          <Typography gutterBottom variant="h4">
            Tistory
          </Typography>
        </Stack>

        {/* 티스토리 로그인 여부에 따라 로그인 / 발행하기 아이콘 변경 */}
        {oauth && oauth?.data.result.tistory ? (
          <Button href="" onClick={onClickHandler}>
            발행하기
          </Button>
        ) : (
          <IconButton href={tistoryLoginURL}>
            <LoginIcon />
          </IconButton>
        )}
      </Stack>
      <Card>
        {isLoading || tistoryInfo === undefined ? (
          <div> 로딩중 ... </div>
        ) : (
          <StyledContainer>
            <Scrollbar>
              {/* 티스토리 로그인 되어있지 않으면 위에 씌우기 */}
              {!oauth?.data.result.tistory ? (
                <StyledWrapper>
                  <Typography variant="subtitle2">
                    티스토리 로그인을 먼저 해주세요.
                  </Typography>
                </StyledWrapper>
              ) : (
                <div></div>
              )}
              <Button onClick={handleAddRow}> 새로운 데이터 추가하기</Button>
              <DataGrid
                disableRowSelectionOnClick
                apiRef={apiRef}
                cellModesModel={cellModesModel}
                columns={columns}
                getRowId={(row) => row.tistoryId}
                pageSizeOptions={[100]}
                rows={rows}
                onCellClick={handleCellClick}
                onCellModesModelChange={handleCellModesModelChange}
              />
            </Scrollbar>
          </StyledContainer>
        )}
      </Card>
    </>
  )
}

export default TistoryPage

// ---------------------------------------------------------------------
const StyledContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  height: 'auto',
}))
const StyledWrapper = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '0px',
  left: '0px',
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: '9999',
}))
