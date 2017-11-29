import React from 'react'
import Paper from 'material-ui/Paper'
import MotorcycleIcon from 'material-ui-icons/Motorcycle'
import HomeIcon from 'material-ui-icons/Home'
import { CircularProgress } from 'material-ui/Progress'
import Timeago from 'js/timeago'

const OrderInProgress = (order, i) => (
  <Paper key={i} elevation={1} className="mb-3 pt-2 pb-2 pl-3 pr-3">
    <div className="text-muted d-flex align-items-center justify-content-between">
      <small>#{order.id}</small>
      <small><Timeago date={order.insertedAt} /></small>
    </div>

    {order.pending ? <Loading /> : MotoboyInfo(order.motoboy)}
  </Paper>
)

const Loading = () => (
  <div className="mt-4 mb-2 d-flex justify-content-center">
    <CircularProgress size={20} />
    <span className="ml-2 text-muted">Aguardando confirmação...</span>
  </div>
)

const MotoboyInfo = (motoboy) => (
  <div className="mt-3">
    <div className="mb-2 d-flex align-items-center">
      <MotorcycleIcon />
      <span className="mr-2 ml-2">{motoboy.name}</span>
      <small className="text-muted"> - {motoboy.phoneNumber}</small>
    </div>
    <div className="mb-2 d-flex align-items-center">
      <HomeIcon />
      <span className="mr-2 ml-2">{motoboy.central.name}</span>
      <small className="text-muted">- {motoboy.central.phoneNumber}</small>
    </div>
  </div>
)


export default OrderInProgress
