// ----------------------------------------------------------------------

const rand_1_25 = Math.floor(Math.random() * 25 + 1)

const account = {
  displayName: sessionStorage.getItem('email'),
  photoURL: `/assets/images/avatars/avatar_${rand_1_25}.jpg`,
  role: '일반회원',
}

export default account
