import {Component} from 'react'
import Loader from 'react-loader-spinner'

import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class App extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    projectsList: [],
    activeCategory: categoriesList[0].id,
  }

  componentDidMount = () => {
    this.getProjectsDataApi()
  }

  getProjectsDataApi = async () => {
    const {activeCategory} = this.state
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const response = await fetch(
      `https://apis.ccbp.in/ps/projects?category=${activeCategory}`,
    )
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      this.setState({
        apiStatus: apiStatusConstants.success,
        projectsList: data.projects,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeCategory = event => {
    this.setState({activeCategory: event.target.value}, this.getProjectsDataApi)
  }

  onRetry = () => {
    this.getProjectsDataApi()
  }

  renderLoader = () => (
    <div className="loaderCon" data-testid="loader">
      <Loader type="ThreeDots" color="#4656a1" height="50" width="50" />
    </div>
  )

  renderFailure = () => (
    <div className="failCon">
      <div className="failCard">
        <img
          src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
          alt="failure view"
          className="failImg"
        />
        <h1 className="failHead">Oops! Something Went Wrong</h1>
        <p className="failPara">
          We cannot seem to find the page you are looking for.
        </p>
        <button type="button" className="failBtn" onClick={this.onRetry}>
          Retry
        </button>
      </div>
    </div>
  )

  successPage = () => {
    const {projectsList} = this.state

    return (
      <ul className="projectsCard">
        {projectsList.map(each => (
          <li key={each.id}>
            <img src={each.image_url} alt={each.name} className="img" />
            <p className="head">{each.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  renderProjects = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.failure:
        return this.renderFailure()
      case apiStatusConstants.success:
        return this.successPage()
      default:
        return null
    }
  }

  render() {
    const {activeCategory} = this.state

    return (
      <div className="bgCon">
        <nav className="navbar">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="webLogo"
          />
        </nav>
        <div className="projectsCon">
          <select
            className="select"
            value={activeCategory}
            onChange={this.onChangeCategory}
          >
            {categoriesList.map(each => (
              <option key={each.id} value={each.id}>
                {each.displayText}
              </option>
            ))}
          </select>
          {this.renderProjects()}
        </div>
      </div>
    )
  }
}

export default App
