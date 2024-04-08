function login() {
    loginBtn = document.getElementById("loginBtnContainer").innerHTML
    document.getElementById("loginBtnContainer").innerHTML = `
    <div class="heartbeat delay-10">
        <div class="loader animate__animated animate__infinite ">
            <span class="stroke"></span>
            <span class="stroke"></span>
            <span class="stroke"></span>
            <span class="stroke"></span>
            <span class="stroke"></span>
            <span class="stroke"></span>
            <span class="stroke"></span>
        </div>
    </div>`

    setTimeout(function () {
        document.getElementById("loginBtnContainer").innerHTML = loginBtn
    }, 750);
}