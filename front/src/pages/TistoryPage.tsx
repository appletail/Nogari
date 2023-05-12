import React, { useState, useCallback, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery, useQueryClient, useMutation } from 'react-query'

import { faker } from '@faker-js/faker'
import LoginIcon from '@mui/icons-material/Login'
import { Card, Stack, Button, Typography } from '@mui/material'
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  GridCellParams,
  GridCellModesModel,
  GridCellModes,
  useGridApiRef,
} from '@mui/x-data-grid'

import { sample, sampleSize } from 'lodash'

import { getOauthStatus } from '@/apis/OauthApis'
import { postTistoryPostList } from '@/apis/tistoryApis'
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
  tags: string
}
// ------------------------------------------------------------------

function TistoryPage() {
  // tistory 연결 여부에 따라 Button 다르게 보이는 부분 설정
  // react query를 사용해서 sidebar에서 받은 로그인 정보 저장
  const { isLoading, data: oauth } = useQuery('oauths', getOauthStatus)
  const { data: tistoryInfo } = useQuery('tistoryInfo', postTistoryPostList, {
    enabled: !!oauth,
  })

  // data grid에서 사용하는 state

  const [blogName, setBlogName] = useState(tistoryInfo?.data.result[1])
  const [rows, setRows] = useState<GridRowsProp>([])

  useEffect(() => {
    if (tistoryInfo) {
      setBlogName(tistoryInfo?.data.result[1])
      // setRows(tistoryInfo?.data.result[0])
    }
  }, [tistoryInfo])

  // rows

  // 새로운 행을 만드는 함수
  const createNewRow = () => {
    return {
      tistoryId: faker.datatype.uuid(),
      visibility: 3,
      status: '발행요청',
      title: '',
      categoryName: '',
      modified_at: '',
      blogName: blogName[0],
      requestLink: '',
      tags: '',
    }
  }

  // add row 에 관련된
  const apiRef = useGridApiRef()
  const handleAddRow = () => {
    const newRow = createNewRow()
    apiRef.current.updateRows([newRow])
  }

  // 행이 수정될 때 사용하는 함수
  const processRowUpdate = (newRow: any, oldRow: any) => {
    setRows((prevRows: any) => {
      const newRows = [...prevRows].map((row) => {
        if (row.id === newRow.id) return newRow
        return row
      })
      return newRows
    })
    return newRow
  }

  // data 제출 시에 사용하는 함수
  const onClickHandler = () => {
    console.log('=======================')
    console.log(apiRef.current.getRowModels())
  }

  const [cellModesModel, setCellModesModel] = useState<GridCellModesModel>({})
  // 더블클릭 > 클릭 시 수정으로 변경
  const handleCellClick = React.useCallback((params: GridCellParams) => {
    // console.log(params)
    if (params.isEditable) {
      setCellModesModel((prevModel) => {
        return {
          // Revert the mode of the other cells from other rows
          ...Object.keys(prevModel).reduce(
            (acc, id) => ({
              ...acc,
              [id]: Object.keys(prevModel[id]).reduce(
                (acc2, field) => ({
                  ...acc2,
                  [field]: {
                    mode: GridCellModes.View,
                  },
                }),
                {}
              ),
            }),
            {}
          ),
          [params.id]: {
            // Revert the mode of other cells in the same row
            ...Object.keys(prevModel[params.id] || {}).reduce(
              (acc, field) => ({
                ...acc,
                [field]: { mode: GridCellModes.View },
              }),
              {}
            ),
            [params.field]: {
              ...(prevModel[params.id] || {})[params.field],
              mode: GridCellModes.Edit,
            },
          },
        }
      })
    }
  }, [])

  const handleCellModesModelChange = React.useCallback((newModel: any) => {
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
      valueOptions: ['cate1', 'cate2', 'cate3'],
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
      valueOptions: ['발행요청', '발행완료', '수정요청'],
      disableColumnMenu: true,
    },
    {
      field: 'title',
      headerName: '제목',
      disableColumnMenu: true,
      hideSortIcons: true,
      editable: false,
    },
  ]

  return (
    <>
      <Helmet>
        <title> Tistory </title>
      </Helmet>

      <Stack alignItems="center" direction="row" mb={5}>
        <Stack alignItems="center" direction="row" spacing={1}>
          <Tistory style={{ width: 24, height: 24 }} />
          <Typography gutterBottom variant="h4">
            Tistory
          </Typography>
        </Stack>
        {oauth && oauth?.data.result.tistory ? (
          <Button onClick={onClickHandler}>발행하기</Button>
        ) : (
          <Button color="primary" startIcon={<LoginIcon />} variant="contained">
            로그인
          </Button>
        )}
      </Stack>
      <Card>
        {isLoading || tistoryInfo === undefined ? (
          <div> 로딩중 ... </div>
        ) : (
          <Scrollbar>
            <div style={{ height: 'auto' }}>
              <Button onClick={handleAddRow}> 새로운 데이터 추가하기</Button>
              <DataGrid
                disableRowSelectionOnClick
                apiRef={apiRef}
                cellModesModel={cellModesModel}
                columns={columns}
                getRowId={(row) => row.tistoryId}
                pageSizeOptions={[100]}
                processRowUpdate={processRowUpdate}
                rows={tistoryInfo?.data.result[0]}
                onCellClick={handleCellClick}
                onCellModesModelChange={handleCellModesModelChange}
              />
            </div>
          </Scrollbar>
        )}
      </Card>
    </>
  )
}

export default TistoryPage
