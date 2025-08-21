import { Outlet } from "react-router"
import { Button } from "./components/ui/button"


function App() {

  return (
    <>
      <div className="flex min-h-svh flex-col items-center justify-center">
        Ride Booking System <Button>Click me</Button>
        <Outlet></Outlet>
      </div>
    </>
  )
}

export default App
