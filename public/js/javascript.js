const username = document.getElementById('name');
const age = document.getElementById('age');
const udname = document.getElementById('udname');
const udage = document.getElementById('udage');
const beforeUserName = document.getElementById('beforename');
const beforeAge = document.getElementById('beforeage');
const button = document.getElementById('button');
const selectinfo = document.getElementsByClassName('selectinfo');
const setname = document.getElementsByClassName('setname');
const setage = document.getElementsByClassName('setage');
const update = document.getElementById('update');
const del = document.getElementById('delete');
const infolist = document.getElementById('infolist');
const start = () => {
    $.ajax({
        type: "GET",
        url: "/users",
    }).done(function (results) {
        for (let i = 0; i < results.length; i++) {
            $("#infolist").append(
                '<li class="selectinfo">name:<span class="setname" id="'+i+'">' + results[i].name + '</span> | age:<span class="setage">' + results[i].age + '</span></li>'
            );
        }
        for (let i = 0; i < selectinfo.length; i++) {
            selectinfo[i].addEventListener('click', function () {
                beforeUserName.value = setname[i].innerHTML;
                beforeAge.value = setage[i].innerHTML;
                console.log(beforeUserName, beforeAge);
                for (let j = 0; j < selectinfo.length; j++) {
                    selectinfo[j].style.backgroundColor = "white";
                }
                selectinfo[i].style.backgroundColor = 'red';
        
            })
        }
    });
}
start();

const set = () => {
    selectinfo[selectinfo.length - 1].addEventListener('click', function () {
        beforeUserName.value = setname[setname.length-1].innerHTML;
        beforeAge.value = setage[setname.length-1].innerHTML;
        console.log(beforeUserName, beforeAge);
        for (let j = 0; j < selectinfo.length; j++) {
            selectinfo[j].style.backgroundColor = "white";
        }
        selectinfo[selectinfo.length-1].style.backgroundColor = 'red';

    })
}
button.addEventListener('click', function () {
    console.log(username.value, age.value);
    let value = {
        name: username.value,
        age: age.value,
    }
    $.ajax({
        type: "POST",
        data: value,
        url: "/users",
    }).done(function (results) {
        console.log(results);
        let val = selectinfo.length
        $("#infolist").append(
            '<li class="selectinfo">name:<span class="setname" id="'+val+'">' + results.name + '</span> | age:<span class="setage">' + results.age + '</span></li>'
        );
        set();
    })
})
update.addEventListener('click', function () {
    let value = {
        name: udname.value,
        age: udage.value,
        beforename: beforeUserName.value,
        beforeage: beforeAge.value,
    }
    $.ajax({
        type: "PUT",
        data: value,
        url: "/users",
    }).done(function (results) {
        $('#infolist').empty();
        udname.value = "";
        udage.value = "";
        beforename.value = "";
        beforeage.value = "";
        start();
    })
});

del.addEventListener('click', function () { 
    let value = {
        beforename: beforeUserName.value,
        beforeage: beforeAge.value,
    }
    $.ajax({
        type: "DELETE",
        data: value,
        url: "/users",
    }).done(function (results) {
        $('#infolist').empty();
        beforename.value = "";
        beforeage.value = "";
        start();
    })
});
