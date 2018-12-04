import React from 'react';
import { Loading } from '../components/Loading';
import { FormBillingPasien} from '../containers/FormBillingPasien';
import { Appointment } from '../utils/Appointment';

export class BillingPasien extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			pasien: {},
			namaPasien: '' 
		}
		Appointment.getDetailPasien(this.props.match.params.id).then(response =>{
			if(response.status === 200){
				this.setState({
					loading: false,
					pasien: response.result,
					namaPasien: response.result.nama
				})
			} else {
				alert('Data tidak ditemukan')
				this.props.history.push('/all-pasien')
			}
		}) 
		this.handleFormSubmit = this.handleFormSubmit.bind(this)
	
	}

	handleFormSubmit(e) {
		e.preventDefault()
		/** 
		 * TODO: Akses method billingStatusPasien(requestBody) pada Appointment dan lakukan billing state. 
		 */
		this.setState({
			loading: true
		})

		const data = new FormData(e.target)
		const dataJson = {}

		data.forEach((val, key) => {
			if (val !== ""){
				let name = key.split('.');
				if (name.length > 1){
					let last = name.pop()
					name.reduce((prev, next) => {
						return prev[next] = prev[next] || {};
					}, dataJson)[last] = val
				} else {
					dataJson[key] = val
				}
			}
		})

		console.log(JSON.stringify(dataJson))
		
		
		Appointment.addBillingPasien(dataJson).then(response => {
			if(response.status === 200){
				this.setState({
					loading: false,
					pasien: response.result
				})
				alert(`Sukses billing pasien ${this.state.namaPasien}`)
			} else {
				this.setState({
					loading: false
				})
				alert(`Gagal billing pasien ${this.state.pasien.nama}`)
			}
		})
	}

	render() {
		if (this.state.loading) {
			return (
				<Loading msg="Fetching Data..." />
			)
		} else {
			return (
				<FormBillingPasien pasien={this.state.pasien} onSubmit={this.handleFormSubmit} />
			)
		}
	}
}