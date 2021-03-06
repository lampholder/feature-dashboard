import React, { Component } from 'react';

import TokenInput from './TokenInput';

class Plan extends Component {

    render() {
        let phases = [...new Set(
            [].concat(...this.props.issues.map(issue =>
                issue.labels.map(label => label.name)
            )))]
            .filter(label => label.startsWith("phase:"))
            .sort((a, b) => {
                return Number(a.split(":")[1]) -
                    Number(b.split(":")[1]);
            });

        let phasedIssues = {};
        phases.forEach(phase => {
            phasedIssues[phase] = this.props.issues.filter(issue => {
                return issue.labels.map(label => label.name)
                    .includes(phase);
            })
                .sort((a, b) => {
                    let states = ['done', 'wip', 'todo'];
                    if (a.state === b.state) {
                        return a.number - b.number;
                    }
                    else {
                        return states.indexOf(a.state) - states.indexOf(b.state);
                    }
                });
        });
        return (
            <div className="Plan">
                <p className="label">{ this.props.labels.join(' ') }</p>
                <ul>
                    {
                        phases.map(phase => {
                            return (
                                <li className="phase" key={ phase }>{ phase }
                                    <ul>
                                        {
                                            phasedIssues[phase].map(issue =>
                                                <li className="task" key={ issue.number }>
                                                    <a href={ issue.url }>{ `${issue.number} ${issue.title}` }</a>
                                                    <span className={ 'state ' + issue.state }>
                                                    {
                                                        issue.state === 'done' ? ' (done)' : issue.state === 'wip' ? ' (in progress)' : ''
                                                    }
                                                    </span>
                                                </li>
                                            )
                                        }
                                    </ul>
                                </li>
                            )
                        })
                    }
                </ul>
                <TokenInput status={ this.props.connectionStatus }/>
            </div>
        );
    }

}

export default Plan;
