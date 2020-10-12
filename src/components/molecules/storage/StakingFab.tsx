import Fab from '@material-ui/core/Fab'
import React, { FC } from 'react'
import StakingIcon from 'assets/images/stakingIcon.svg'

export type StakingFabProps = {
  className?: string
  onClick?: () => void
}

const StakingFab: FC<StakingFabProps> = ({ onClick, className = '' }) => (
  <Fab
    className={className}
    color="primary"
    aria-label="staking"
    onClick={onClick}
  >
    <img src={StakingIcon} alt="staking icon" />
  </Fab>
)

export default StakingFab
