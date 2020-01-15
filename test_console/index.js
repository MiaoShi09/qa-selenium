exports.test_console_not_signin = async function() {
    await browse_with_address()
    await  driver.navigate().to('https://localhost:3000/staking/console')
    await click('sidebar-menu-staking')
    await clear_address()

    await browse_with_address()
    await  driver.navigate().to('https://localhost:3000/staking/console')
    await click('sidebar-menu-staking')
    await clear_address()

    await browse_with_address()
    await  driver.navigate().to('https://localhost:3000/staking/console')
    await click('sidebar-menu-staking')
    await clear_address()

    await browse_with_address()
    await  driver.navigate().to('https://localhost:3000/staking/console')
    await click('sidebar-menu-staking')
    await clear_address()

    await signin_with_private_key()
    await  driver.navigate().to('https://localhost:3000/staking/console')
    await click('sidebar-menu-staking')
    await clear_address()

    await signin_with_private_key()
    await  driver.navigate().to('https://localhost:3000/staking/console')
    await click('sidebar-menu-staking')
    await clear_address()

    await signin_with_private_key()
    await  driver.navigate().to('https://localhost:3000/staking/console')
    await click('sidebar-menu-staking')
    await clear_address()
}
