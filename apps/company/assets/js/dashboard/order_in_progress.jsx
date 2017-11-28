import React from 'react'

import Paper from 'material-ui/Paper'
import MotorcycleIcon from 'material-ui-icons/Motorcycle'
import { CircularProgress } from 'material-ui/Progress'
import Timeago from 'js/timeago'

const OrderInProgress = (order) => (
  <Paper key={order.id} elevation={1}>
    <div>
      <span>#{order.id}</span>
      <span><Timeago date={order.insertedAt} /></span>
    </div>

    {order.pending ? <Loading /> : <MotoboyInfo motoboy={order.motoboy} />}
  </Paper>
)

const Loading = () => (
  <div>
    <CircularProgress size={20} />
    <span>Aguardando confirmação...</span>
  </div>
)

const MotoboyInfo = (motoboy) => (
  <div>
    <div>
      <div>
        <MotorcycleIcon />
        <span>{motoboy.name}</span>
        <span> - {motoboy.central.name}</span>
      </div>
    </div>
  </div>
)

export default OrderInProgress
