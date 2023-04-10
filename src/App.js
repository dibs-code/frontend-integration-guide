import {Route, Routes} from 'react-router-dom'

import Header from './components/common/Header'

import {RefreshContextProvider} from './context/RefreshContext'
import {VeTHEsContextProvider} from './context/veTHEsConetext'
import {BaseAssetsConetextProvider} from './context/BaseAssetsConetext'
// import {Route/AssetsConetextProvider} from './context/RouteAssetsConetext'
import {PairsContextProvider} from './context/PairsContext'

import Rewards from './pages/rewards'
import Referral from './pages/referral'

const App = () => {
  return (
    <div className='main'>
      <RefreshContextProvider>
        <BaseAssetsConetextProvider>
          <PairsContextProvider>
            <VeTHEsContextProvider>
              <Header/>
              <Routes>
                <Route path='/rewards' element={<Rewards/>} exact/>
                <Route path='/referral' element={<Referral/>} exact/>
              </Routes>
            </VeTHEsContextProvider>
          </PairsContextProvider>
        </BaseAssetsConetextProvider>
      </RefreshContextProvider>
    </div>
  )
}

export default App
