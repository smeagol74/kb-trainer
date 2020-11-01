export const rt = {
	home: '/',
	login: '/login',
	keyboard: '/keyboard/:id',
	practice: '/practice/:id',
	about: '/about'
}

export const url = {
	home: rt.home,
	login: rt.login,
	keyboard: (id: string) => rt.keyboard.replace(':id', id),
	practice: (id: string) => rt.practice.replace(':id', id),
	about: rt.about
}
