const fillDays = daysForTheMonth => {
    return [...Array(daysForTheMonth + 1).keys()].splice(1)
}

const context = {
    months: [
        {
            name: 'November 2017',
            date: '2017-11',
            days: fillDays(30),
            off: [11]
        },
        {
            name: 'December 2017',
            date: '2017-12',
            days: fillDays(31),
            off: [25]
        }
    ]
};

let remaining = context.months.length;
for (let month of context.months) {
    for (let day of month.days) {
        const date = new Date(`${month.date}-${day}`).getDay();
        console.log(`${month.date}-${day} > `, month.off);
        if (date === 0 || date === 6) { // Sunday or Saturday
            month.off.push(day);
        }
    }

    month.team = [];
    const request = new XMLHttpRequest();
    request.open('GET', `data/${month.date}.json`, true);
    
    request.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        var data = JSON.parse(this.response);
        console.log('GOT !', data);
        for (let person of data) {
            let days = month.days.map(d => {
                if (month.off.indexOf(d) > -1) {
                    return 'table-dark';
                }
                return person.off.indexOf(d) > -1 ? 'table-danger' : 'table-success';
            });

            month.team.push({
                name: person.name,
                off: days
            });
        }
      } else {
          console.log('error');
      }
      remaining--;
      if (remaining === 0) {
          loadTemplate();
      }
    };
    request.onerror = () => {
        console.log('Error');
    }
    request.send();
}

const loadTemplate = () => {
    const source = document.querySelector('#calendar').innerHTML;
    const template = Handlebars.compile(source);
    const rendered = template(context);
    console.log('template:', JSON.stringify(context))
    document.querySelector('#rendered').innerHTML = rendered;    
}

//loadTemplate();
