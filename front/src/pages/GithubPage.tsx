import React, { useState, useCallback, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery } from 'react-query'

import { faker } from '@faker-js/faker'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import LoginIcon from '@mui/icons-material/Login'
import {
  Card,
  Stack,
  Button,
  Typography,
  IconButton,
  LinearProgress,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import {
  DataGrid,
  GridColDef,
  GridSingleSelectColDef,
  GridEditSingleSelectCellProps,
  GridCellParams,
  GridEditSingleSelectCell,
  GridCellModesModel,
  GridCellModes,
  useGridApiRef,
} from '@mui/x-data-grid'

import { postGithubPostList, postGithubPost } from '@/apis/githubApis'
import { getOauthStatus } from '@/apis/OauthApis'
import { ReactComponent as Github } from '@/assets/logos/github-mark.svg'

import Scrollbar from '@/components/scrollbar/Scrollbar'

// ------------------------------------------------------------------
// interface

interface githubPosting {
  githubId: string
  filename: string
  repository: string
  status: string
  requestLink: string
  responseLink: string
  sha: string
  categoryName: string
  modifiedDate: string
}

interface CustomTypeEditComponentProps extends GridEditSingleSelectCellProps {
  setRows: React.Dispatch<React.SetStateAction<any[]>>
}

interface githubCategory {
  name: string
  path: string
  sha: string
  size: number
  url: string
  html_url: string
  git_url: string
  download_url: null | string
  type: string
  _links: object
}

// -------------------------------------------------------------------------------

function CustomTypeEditComponent(props: CustomTypeEditComponentProps) {
  const { setRows, ...other } = props

  const handleValueChange = () => {
    setRows((prevRows) => {
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

function GithubPage() {
  // github 연결 여부에 따라 Button 다르게 보이는 부분 설정
  // react query를 사용해서 sidebar에서 받은 로그인 정보 저장
  // github 연결되어 있을 때에만 githubInfo를 받아옵니다.
  const apiRef = useGridApiRef()
  const { isLoading, data: oauth } = useQuery('oauths', getOauthStatus)
  const {
    isLoading: githubInfoLoading,
    data: githubInfo,
    refetch,
  } = useQuery('githubInfo', postGithubPostList, {
    refetchOnWindowFocus: false,
    enabled: !!oauth,
  })

  // data grid에서 사용하는 state
  // row data and blog name
  const [rows, setRows] = useState<any[]>([])
  const [repository, setRepositoryName] = useState(
    githubInfo?.data.result[1] || ['']
  )

  // cell mode : edit or view
  const [cellModesModel, setCellModesModel] = useState<GridCellModesModel>({})

  useEffect(() => {
    if (githubInfo) {
      const RowData = githubInfo.data.result[0]
      setRows(RowData)
      setRepositoryName(githubInfo?.data.result[1])
    }
  }, [githubInfo])

  // 새로운 행을 만드는 함수
  const createNewRow = () => {
    return {
      githubId: faker.datatype.uuid(),
      status: '발행요청',
      filename: '',
      modifiedDate: '',
      repository: repository[0],
      requestLink: '',
      categoryName: '',
      sha: '',
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
        row.categoryName &&
        (row.status === '발행요청' || row.status === '수정요청')
      ) {
        row['type'] = 'md'
        submitArray.push(row)
      }
    })
    // 발행할 최종 데이터 리스트가 있는 경우에만 post 요청을 보냅니다
    if (submitArray.length !== 0) {
      const response = await postGithubPost(submitArray)
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
    if (!params.isEditable) return
    if (params.cellMode === 'view') {
      setCellModesModel((prevModel: any) => {
        return {
          [params.id]: {
            ...Object.keys(prevModel[params.id] || {}).reduce((acc, field) => {
              return {
                ...acc,
                [field]: { mode: GridCellModes.View },
              }
            }, {}),
            [params.field]: { mode: GridCellModes.Edit },
          },
        }
      })
    } else {
      setCellModesModel((prevModel: any) => {
        return {
          [params.id]: {
            ...Object.keys(prevModel[params.id] || {}).reduce((acc, field) => {
              return {
                ...acc,
                [field]: { mode: GridCellModes.View },
              }
            }, {}),
            [params.field]: { mode: GridCellModes.View },
          },
        }
      })
    }
    params.hasFocus = !params.hasFocus
  }, [])

  const handleCellModesModelChange = useCallback((newModel: any) => {
    setCellModesModel(newModel)
  }, [])

  const columns: (GridColDef | GridSingleSelectColDef)[] = [
    {
      field: 'repository',
      headerName: '레포지토리',
      type: 'singleSelect',
      valueOptions: repository,
      minWidth: 150,
      flex: 0.3,
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
      minWidth: 220,
      editable: true,
      disableColumnMenu: true,
      hideSortIcons: true,
      flex: 1,
    },
    {
      field: 'categoryName',
      headerName: '카테고리',
      type: 'singleSelect',
      valueOptions: ({ row }) => {
        if (!row) {
          return [{ value: 'None', label: '카테고리없음' }]
        }

        const index = repository.indexOf(row.repository)
        const selectedCategories = githubInfo?.data.result[2][index]
        return selectedCategories
          ? selectedCategories.map((category: githubCategory) => {
              return { value: category.name, label: category.name }
            })
          : [{ value: 'None', label: '카테고리없음' }]
      },
      editable: true,
      disableColumnMenu: true,
    },
    {
      field: 'modifiedDate',
      headerName: '발행일자',
      width: 120,
      editable: false,
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
      valueOptions: ({ field, row }) => {
        if (!row) {
          return ['발행요청', '발행완료', '수정요청', '발행실패', '수정실패']
        } else if (row.status === '발행완료' || row.status === '수정요청') {
          return ['발행완료', '수정요청']
        } else if (row.status === '발행실패') {
          return ['발행실패', '발행요청']
        } else if (row.status === '수정실패') {
          return ['수정실패', '수정요청']
        } else if (row.status === '발행요청') {
          return ['발행요청']
        }
        return ['발행요청', '발행완료', '수정요청', '발행실패', '수정실패']
      },
      disableColumnMenu: true,
    },
    {
      field: 'filename',
      headerName: '제목',
      disableColumnMenu: true,
      hideSortIcons: true,
      editable: false,
      flex: 1,
      minWidth: 50,
    },
  ]

  const githubLoginURL = import.meta.env.VITE_GITHUB_OAUTH_URL

  return (
    <>
      <Helmet>
        <title>Nogari | Github</title>
      </Helmet>

      {/* github 아이콘 & 로그인 */}
      <Stack alignItems="center" direction="row" mb={3}>
        <Stack
          alignItems="center"
          direction="row"
          spacing={1}
          sx={{ marginRight: '1rem' }}
        >
          <Github style={{ width: 24, height: 24 }} />
          <Typography gutterBottom variant="h4">
            Github
          </Typography>
        </Stack>

        {/* github 로그인 여부에 따라 로그인 / 발행하기 아이콘 변경 */}
        {oauth && oauth?.data.result.github ? (
          <Button
            href=""
            variant="contained"
            sx={{
              width: '70px',
              height: '26px',
              backgroundColor: '#007DFF',
              fontSize: '0.1rem',
              whiteSpace: 'nowrap',
            }}
            onClick={onClickHandler}
          >
            발행하기
          </Button>
        ) : (
          <IconButton href={githubLoginURL}>
            <LoginIcon />
          </IconButton>
        )}
      </Stack>

      {/* 새로운 행 추가하는 button */}

      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <Button sx={{ display: 'flex', gap: '5px' }} onClick={handleAddRow}>
          <AddCircleOutlineIcon />
          add row
        </Button>
      </div>

      <Card>
        {/* {isLoading || githubInfo === undefined ? (
          <div> 로딩중 ... </div>
        ) : ( */}
        <StyledContainer>
          <Scrollbar>
            {/* 깃허브 로그인 되어있지 않으면 위에 씌우기 */}
            {!oauth?.data.result.github ? (
              <StyledWrapper>
                <Typography variant="subtitle2">
                  깃허브 로그인을 먼저 해주세요.
                </Typography>
              </StyledWrapper>
            ) : (
              <div></div>
            )}
            <DataGrid
              autoHeight
              hideFooter
              hideFooterPagination
              hideFooterSelectedRowCount
              apiRef={apiRef}
              cellModesModel={cellModesModel}
              columns={columns}
              editMode="cell"
              getRowId={(row) => row.githubId}
              loading={isLoading || githubInfoLoading}
              rows={rows}
              slots={{
                loadingOverlay: LinearProgress,
              }}
              onCellClick={handleCellClick}
              onCellModesModelChange={handleCellModesModelChange}
            />
          </Scrollbar>
        </StyledContainer>
        {/* )} */}
      </Card>
    </>
  )
}

export default GithubPage

// ---------------------------------------------------------------------
const StyledContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  // height: 'auto',
  minHeight: '200px',
  width: '100%',
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
